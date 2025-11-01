import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Subscription } from '../../entities/subscription.entity';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendRenewalReminder(
    email: string,
    subscription: Subscription,
  ): Promise<void> {
    const daysUntilRenewal = Math.ceil(
      (new Date(subscription.nextRenewalDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@subscriptiontracker.com',
      to: email,
      subject: `Reminder: ${subscription.name} renewal in ${daysUntilRenewal} days`,
      html: this.getReminderEmailTemplate(subscription, daysUntilRenewal),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Reminder email sent to ${email} for ${subscription.name}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  private getReminderEmailTemplate(
    subscription: Subscription,
    daysUntilRenewal: number,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4F46E5;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9fafb;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .subscription-card {
              background-color: white;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .amount {
              font-size: 24px;
              font-weight: bold;
              color: #4F46E5;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              color: #6B7280;
              margin-top: 20px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Subscription Renewal Reminder</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>This is a friendly reminder that your subscription is coming up for renewal:</p>
              
              <div class="subscription-card">
                <h2>${subscription.name}</h2>
                <p><strong>Amount:</strong> <span class="amount">${subscription.currency} ${subscription.amount}</span></p>
                <p><strong>Billing Cycle:</strong> ${subscription.billingCycle}</p>
                <p><strong>Renewal Date:</strong> ${new Date(subscription.nextRenewalDate).toLocaleDateString()}</p>
                <p><strong>Days Until Renewal:</strong> ${daysUntilRenewal} days</p>
                ${subscription.description ? `<p><strong>Description:</strong> ${subscription.description}</p>` : ''}
              </div>

              <p>Please ensure you have sufficient funds in your account to avoid service interruption.</p>
              
              ${subscription.website ? `<a href="${subscription.website}" class="button">Manage Subscription</a>` : ''}

              <div class="footer">
                <p>You're receiving this email because you enabled reminders for this subscription.</p>
                <p>Manage your subscriptions and preferences in your dashboard.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@subscriptiontracker.com',
      to: email,
      subject: 'Welcome to Subscription Tracker!',
      html: `
        <h1>Welcome to Subscription Tracker, ${name}!</h1>
        <p>Thank you for signing up. Start tracking your subscriptions and never miss a renewal again.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }
}

