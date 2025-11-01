import { Module } from '@nestjs/common';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email.service';
import { ReminderScheduler } from './reminder.scheduler';

@Module({
  imports: [SubscriptionsModule],
  providers: [NotificationsService, EmailService, ReminderScheduler],
  exports: [NotificationsService, EmailService],
})
export class NotificationsModule {}

