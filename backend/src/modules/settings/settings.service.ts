import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettings } from '../../entities/user-settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private settingsRepository: Repository<UserSettings>,
  ) {}

  async getSettings(userId: string): Promise<UserSettings> {
    let settings = await this.settingsRepository.findOne({
      where: { userId },
    });

    // Create default settings if none exist
    if (!settings) {
      settings = this.settingsRepository.create({
        userId,
        monthlyBudget: null,
        budgetAlertsEnabled: true,
        budgetAlertThreshold: 90,
      });
      await this.settingsRepository.save(settings);
    }

    return settings;
  }

  async updateSettings(
    userId: string,
    dto: UpdateSettingsDto,
  ): Promise<UserSettings> {
    const settings = await this.getSettings(userId);

    if (dto.monthlyBudget !== undefined) {
      settings.monthlyBudget = dto.monthlyBudget;
    }
    if (dto.budgetAlertsEnabled !== undefined) {
      settings.budgetAlertsEnabled = dto.budgetAlertsEnabled;
    }
    if (dto.budgetAlertThreshold !== undefined) {
      settings.budgetAlertThreshold = dto.budgetAlertThreshold;
    }

    return this.settingsRepository.save(settings);
  }

  async checkBudgetStatus(
    userId: string,
    currentMonthlySpending: number,
  ): Promise<{
    withinBudget: boolean;
    budgetAmount: number | null;
    spendingAmount: number;
    percentageUsed: number | null;
    alertTriggered: boolean;
  }> {
    const settings = await this.getSettings(userId);

    if (!settings.monthlyBudget) {
      return {
        withinBudget: true,
        budgetAmount: null,
        spendingAmount: currentMonthlySpending,
        percentageUsed: null,
        alertTriggered: false,
      };
    }

    const percentageUsed = (currentMonthlySpending / settings.monthlyBudget) * 100;
    const withinBudget = currentMonthlySpending <= settings.monthlyBudget;
    const alertTriggered =
      settings.budgetAlertsEnabled &&
      percentageUsed >= settings.budgetAlertThreshold;

    return {
      withinBudget,
      budgetAmount: settings.monthlyBudget,
      spendingAmount: currentMonthlySpending,
      percentageUsed: Math.round(percentageUsed * 10) / 10,
      alertTriggered,
    };
  }
}

