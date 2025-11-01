import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../entities/subscription.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async getSpendingSummary(userId: string) {
    const subscriptions = await this.subscriptionRepository.find({
      where: { userId, isActive: true },
    });

    let monthlyTotal = 0;
    let yearlyTotal = 0;

    subscriptions.forEach((sub) => {
      const amount = Number(sub.amount);
      switch (sub.billingCycle) {
        case 'monthly':
          monthlyTotal += amount;
          yearlyTotal += amount * 12;
          break;
        case 'yearly':
          monthlyTotal += amount / 12;
          yearlyTotal += amount;
          break;
        case 'quarterly':
          monthlyTotal += amount / 3;
          yearlyTotal += amount * 4;
          break;
        case 'weekly':
          monthlyTotal += amount * 4.33;
          yearlyTotal += amount * 52;
          break;
      }
    });

    return {
      monthlyTotal: Math.round(monthlyTotal * 100) / 100,
      yearlyTotal: Math.round(yearlyTotal * 100) / 100,
      totalSubscriptions: subscriptions.length,
      currency: subscriptions[0]?.currency || 'USD',
    };
  }

  async getSpendingByCategory(userId: string) {
    const subscriptions = await this.subscriptionRepository.find({
      where: { userId, isActive: true },
    });

    const categoryMap = new Map<string, number>();

    subscriptions.forEach((sub) => {
      const amount = Number(sub.amount);
      let monthlyAmount = 0;

      switch (sub.billingCycle) {
        case 'monthly':
          monthlyAmount = amount;
          break;
        case 'yearly':
          monthlyAmount = amount / 12;
          break;
        case 'quarterly':
          monthlyAmount = amount / 3;
          break;
        case 'weekly':
          monthlyAmount = amount * 4.33;
          break;
      }

      const currentAmount = categoryMap.get(sub.category) || 0;
      categoryMap.set(sub.category, currentAmount + monthlyAmount);
    });

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
    }));
  }

  async getMonthlyTrend(userId: string, months: number = 12) {
    const subscriptions = await this.subscriptionRepository.find({
      where: { userId },
    });

    const monthlyData = [];
    const today = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      let monthTotal = 0;

      subscriptions.forEach((sub) => {
        const subDate = new Date(sub.createdAt);
        if (subDate <= date && sub.isActive) {
          const amount = Number(sub.amount);
          switch (sub.billingCycle) {
            case 'monthly':
              monthTotal += amount;
              break;
            case 'yearly':
              monthTotal += amount / 12;
              break;
            case 'quarterly':
              monthTotal += amount / 3;
              break;
            case 'weekly':
              monthTotal += amount * 4.33;
              break;
          }
        }
      });

      monthlyData.push({
        month: monthName,
        total: Math.round(monthTotal * 100) / 100,
      });
    }

    return monthlyData;
  }

  async getSubscriptionStats(userId: string) {
    const subscriptions = await this.subscriptionRepository.find({
      where: { userId },
    });

    const active = subscriptions.filter((s) => s.isActive).length;
    const inactive = subscriptions.filter((s) => !s.isActive).length;
    const categories = new Set(subscriptions.map((s) => s.category)).size;

    return {
      total: subscriptions.length,
      active,
      inactive,
      categories,
    };
  }
}

