import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import { NotificationsService } from './notifications.service';

@Injectable()
export class ReminderScheduler implements OnModuleInit {
  private queue: Queue;
  private worker: Worker;

  constructor(private notificationsService: NotificationsService) {}

  async onModuleInit() {
    const redisConnection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    };

    // Create queue
    this.queue = new Queue('renewal-reminders', {
      connection: redisConnection,
    });

    // Create worker
    this.worker = new Worker(
      'renewal-reminders',
      async (job) => {
        console.log('Processing reminder job:', job.name);
        await this.notificationsService.sendRenewalReminders();
      },
      {
        connection: redisConnection,
      },
    );

    // Schedule daily job at 9 AM
    await this.queue.add(
      'daily-reminders',
      {},
      {
        repeat: {
          pattern: '0 9 * * *', // Every day at 9 AM
        },
      },
    );

    console.log('✅ Reminder scheduler initialized');

    // Optional: Run once on startup for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('Running initial reminder check...');
      await this.notificationsService.sendRenewalReminders();
    }
  }

  async onModuleDestroy() {
    await this.queue.close();
    await this.worker.close();
  }
}

