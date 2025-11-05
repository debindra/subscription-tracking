import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorators/user.decorator';

@Controller('settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(@User() user: any) {
    return this.settingsService.getSettings(user.id);
  }

  @Patch()
  async updateSettings(@User() user: any, @Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(user.id, dto);
  }

  @Get('budget-status')
  async getBudgetStatus(
    @User() user: any,
    @Body('currentSpending') currentSpending: number,
  ) {
    return this.settingsService.checkBudgetStatus(user.id, currentSpending);
  }
}

