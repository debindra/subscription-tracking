import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingsService } from './settings.service';
import { UserSettings } from '../../entities/user-settings.entity';

describe('SettingsService', () => {
  let service: SettingsService;
  let repository: Repository<UserSettings>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockSettings: Partial<UserSettings> = {
    id: '1',
    userId: 'user-1',
    monthlyBudget: 100,
    budgetAlertsEnabled: true,
    budgetAlertThreshold: 90,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: getRepositoryToken(UserSettings),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    repository = module.get<Repository<UserSettings>>(
      getRepositoryToken(UserSettings),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSettings', () => {
    it('should return existing settings', async () => {
      mockRepository.findOne.mockResolvedValue(mockSettings);

      const result = await service.getSettings('user-1');

      expect(result).toEqual(mockSettings);
    });

    it('should create default settings if none exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockSettings);
      mockRepository.save.mockResolvedValue(mockSettings);

      const result = await service.getSettings('user-1');

      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('checkBudgetStatus', () => {
    it('should return budget status when budget is set', async () => {
      mockRepository.findOne.mockResolvedValue(mockSettings);

      const result = await service.checkBudgetStatus('user-1', 95);

      expect(result.withinBudget).toBe(true);
      expect(result.budgetAmount).toBe(100);
      expect(result.spendingAmount).toBe(95);
      expect(result.percentageUsed).toBe(95);
      expect(result.alertTriggered).toBe(true); // 95% >= 90% threshold
    });

    it('should detect over-budget spending', async () => {
      mockRepository.findOne.mockResolvedValue(mockSettings);

      const result = await service.checkBudgetStatus('user-1', 105);

      expect(result.withinBudget).toBe(false);
      expect(result.percentageUsed).toBe(105);
    });

    it('should return null values when no budget is set', async () => {
      const settingsNoBudget = { ...mockSettings, monthlyBudget: null };
      mockRepository.findOne.mockResolvedValue(settingsNoBudget);

      const result = await service.checkBudgetStatus('user-1', 50);

      expect(result.budgetAmount).toBeNull();
      expect(result.percentageUsed).toBeNull();
      expect(result.alertTriggered).toBe(false);
    });
  });
});

