import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../entities/subscription.entity';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = this.subscriptionRepository.create({
      ...createSubscriptionDto,
      userId,
    });

    return this.subscriptionRepository.save(subscription);
  }

  async findAllByUser(userId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { userId },
      order: { nextRenewalDate: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id, userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  async update(
    id: string,
    userId: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.findOne(id, userId);

    Object.assign(subscription, updateSubscriptionDto);

    return this.subscriptionRepository.save(subscription);
  }

  async remove(id: string, userId: string): Promise<void> {
    const subscription = await this.findOne(id, userId);
    await this.subscriptionRepository.remove(subscription);
  }

  async getUpcomingRenewals(userId: string, days: number = 7): Promise<Subscription[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.userId = :userId', { userId })
      .andWhere('subscription.isActive = :isActive', { isActive: true })
      .andWhere('subscription.reminderEnabled = :reminderEnabled', { reminderEnabled: true })
      .andWhere('subscription.nextRenewalDate BETWEEN :today AND :futureDate', {
        today: today.toISOString().split('T')[0],
        futureDate: futureDate.toISOString().split('T')[0],
      })
      .getMany();
  }

  async getAllUpcomingRenewals(days: number = 7): Promise<Subscription[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.isActive = :isActive', { isActive: true })
      .andWhere('subscription.reminderEnabled = :reminderEnabled', { reminderEnabled: true })
      .andWhere('subscription.nextRenewalDate BETWEEN :today AND :futureDate', {
        today: today.toISOString().split('T')[0],
        futureDate: futureDate.toISOString().split('T')[0],
      })
      .getMany();
  }
}

