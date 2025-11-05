import { IsBoolean, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyBudget?: number | null;

  @IsOptional()
  @IsBoolean()
  budgetAlertsEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  budgetAlertThreshold?: number;
}

