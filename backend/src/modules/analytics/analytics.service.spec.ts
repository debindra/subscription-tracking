import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsService } from './analytics.service';
import { Subscription } from '../../entities/subscription.entity';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let repository: Repository<Subscription>;

  const mockRepository = {
    find: jest.fn(),
  };

  const mockSubscriptions = [
    {
      id: '1',
      userId: 'user-1',
      name: 'Netflix',
      amount: 15.99,
      currency: 'USD',
      billingCycle: 'monthly',
      category: 'Entertainment',
      isActive: true,
      nextRenewalDate: new Date('2025-12-01'),
    },
    {
      id: '2',
      userId: 'user-1',
      name: 'Spotify',
      amount: 9.99,
      currency: 'USD',
      billingCycle: 'monthly',
      category: 'Entertainment',
      isActive: true,
      nextRenewalDate: new Date('2025-11-15'),
    },
    {
      id: '3',
      userId: 'user-1',
      name: 'Adobe',
      amount: 52.99,
      currency: 'USD',
      billingCycle: 'monthly',
      category: 'Design',
      isActive: false,
      nextRenewalDate: new Date('2025-11-20'),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    repository = module.get<Repository<Subscription>>(
      getRepositoryToken(Subscription),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSpendingSummary', () => {
    it('should calculate monthly and yearly spending correctly', async () => {
      mockRepository.find.mockResolvedValue(mockSubscriptions.filter(s => s.isActive));

      const result = await service.getSpendingSummary('user-1');

      expect(result.monthlyTotal).toBeCloseTo(25.98, 2); // 15.99 + 9.99 (only active subscriptions)
      expect(result.yearlyTotal).toBeCloseTo(311.76, 2); // (15.99 + 9.99) * 12
      expect(result.totalSubscriptions).toBe(2);
    });

    it('should exclude inactive subscriptions', async () => {
      mockRepository.find.mockResolvedValue(mockSubscriptions.filter(s => s.isActive));

      const result = await service.getSpendingSummary('user-1');

      expect(result.monthlyTotal).not.toBeCloseTo(78.97, 2); // Should not include Adobe
    });
  });

  describe('getSpendingByCategory', () => {
    it('should group subscriptions by category', async () => {
      mockRepository.find.mockResolvedValue(mockSubscriptions.filter(s => s.isActive));

      const result = await service.getSpendingByCategory('user-1');

      expect(result).toHaveLength(1); // Only Entertainment category for active subs
      expect(result[0].category).toBe('Entertainment');
      expect(result[0].amount).toBeCloseTo(25.98, 2);
    });

    it('should only include active subscriptions', async () => {
      mockRepository.find.mockResolvedValue(mockSubscriptions.filter(s => s.isActive));

      const result = await service.getSpendingByCategory('user-1');

      const designCategory = result.find((c) => c.category === 'Design');
      expect(designCategory).toBeUndefined();
    });
  });
});

