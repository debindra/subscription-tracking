import { Injectable } from '@nestjs/common';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { EmailService } from './email.service';
import { supabaseAdmin } from '../../config/supabase.config';

@Injectable()
export class NotificationsService {
  constructor(
    private subscriptionsService: SubscriptionsService,
    private emailService: EmailService,
  ) {}

  async sendRenewalReminders(): Promise<void> {
    try {
      // Get all subscriptions with upcoming renewals
      const subscriptions = await this.subscriptionsService.getAllUpcomingRenewals(7);

      console.log(`Found ${subscriptions.length} subscriptions with upcoming renewals`);

      for (const subscription of subscriptions) {
        try {
          // Get user email from Supabase
          const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(
            subscription.userId,
          );

          if (error || !user) {
            console.error(`User not found for subscription ${subscription.id}`);
            continue;
          }

          // Send reminder email
          await this.emailService.sendRenewalReminder(user.user.email, subscription);
        } catch (error) {
          console.error(
            `Error sending reminder for subscription ${subscription.id}:`,
            error,
          );
        }
      }
    } catch (error) {
      console.error('Error in sendRenewalReminders:', error);
    }
  }
}

