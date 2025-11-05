import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let subscriptionsService: SubscriptionsService;

  const mockSubscriptionsService = {
    findAll: jest.fn(),
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
          provide: SubscriptionsService,
          useValue: mockSubscriptionsService,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    subscriptionsService = module.get<SubscriptionsService>(
      SubscriptionsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMonthlySpending', () => {
    it('should calculate monthly spending correctly', async () => {
      mockSubscriptionsService.findAll.mockResolvedValue(mockSubscriptions);

      const result = await service.getMonthlySpending('user-1');

      expect(result).toBeCloseTo(25.98, 2); // 15.99 + 9.99 (only active subscriptions)
    });

    it('should exclude inactive subscriptions', async () => {
      mockSubscriptionsService.findAll.mockResolvedValue(mockSubscriptions);

      const result = await service.getMonthlySpending('user-1');

      expect(result).not.toBeCloseTo(78.97, 2); // Should not include Adobe
    });
  });

  describe('getYearlySpending', () => {
    it('should calculate yearly spending correctly', async () => {
      mockSubscriptionsService.findAll.mockResolvedValue(mockSubscriptions);

      const result = await service.getYearlySpending('user-1');

      expect(result).toBeCloseTo(311.76, 2); // (15.99 + 9.99) * 12
    });
  });

  describe('getCategoryBreakdown', () => {
    it('should group subscriptions by category', async () => {
      mockSubscriptionsService.findAll.mockResolvedValue(mockSubscriptions);

      const result = await service.getCategoryBreakdown('user-1');

      expect(result).toHaveLength(2);
      expect(result[0].category).toBe('Entertainment');
      expect(result[0].count).toBe(2);
      expect(result[0].totalAmount).toBeCloseTo(25.98, 2);
    });

    it('should only include active subscriptions', async () => {
      mockSubscriptionsService.findAll.mockResolvedValue(mockSubscriptions);

      const result = await service.getCategoryBreakdown('user-1');

      const designCategory = result.find((c) => c.category === 'Design');
      expect(designCategory).toBeUndefined();
    });
  });
});

