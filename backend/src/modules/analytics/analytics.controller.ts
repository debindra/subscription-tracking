import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorators/user.decorator';

@Controller('analytics')
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('spending')
  getSpendingSummary(@User('id') userId: string) {
    return this.analyticsService.getSpendingSummary(userId);
  }

  @Get('by-category')
  getSpendingByCategory(@User('id') userId: string) {
    return this.analyticsService.getSpendingByCategory(userId);
  }

  @Get('monthly-trend')
  getMonthlyTrend(
    @User('id') userId: string,
    @Query('months') months?: string,
  ) {
    const monthsCount = months ? parseInt(months, 10) : 12;
    return this.analyticsService.getMonthlyTrend(userId, monthsCount);
  }

  @Get('stats')
  getSubscriptionStats(@User('id') userId: string) {
    return this.analyticsService.getSubscriptionStats(userId);
  }
}

