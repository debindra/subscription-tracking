import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from '../../entities/subscription.entity';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let repository: Repository<Subscription>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  const mockSubscription: Partial<Subscription> = {
    id: '123',
    userId: 'user-1',
    name: 'Netflix',
    amount: 15.99,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: new Date('2025-12-01'),
    category: 'Entertainment',
    isActive: true,
    reminderEnabled: true,
    reminderDaysBefore: 7,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
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

  describe('create', () => {
    it('should create a new subscription', async () => {
      const createDto = {
        name: 'Netflix',
        amount: 15.99,
        currency: 'USD',
        billingCycle: 'monthly',
        nextRenewalDate: '2025-12-01',
        category: 'Entertainment',
      };

      mockRepository.create.mockReturnValue(mockSubscription);
      mockRepository.save.mockResolvedValue(mockSubscription);

      const result = await service.create('user-1', createDto as any);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        userId: 'user-1',
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockSubscription);
    });
  });

  describe('findAllByUser', () => {
    it('should return all subscriptions for a user', async () => {
      const subscriptions = [mockSubscription];
      mockRepository.find.mockResolvedValue(subscriptions);

      const result = await service.findAllByUser('user-1');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        order: { nextRenewalDate: 'ASC' },
      });
      expect(result).toEqual(subscriptions);
    });
  });

  describe('findOne', () => {
    it('should return a subscription by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockSubscription);

      const result = await service.findOne('user-1', '123');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123', userId: 'user-1' },
      });
      expect(result).toEqual(mockSubscription);
    });

    it('should throw NotFoundException if subscription not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('user-1', '999')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a subscription', async () => {
      const updateDto = { amount: 19.99 };
      const updatedSubscription = { ...mockSubscription, amount: 19.99 };

      mockRepository.findOne.mockResolvedValue(mockSubscription);
      mockRepository.save.mockResolvedValue(updatedSubscription as Subscription);

      const result = await service.update('123', 'user-1', updateDto);

      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.amount).toBe(19.99);
    });
  });

  describe('remove', () => {
    it('should delete a subscription', async () => {
      mockRepository.findOne.mockResolvedValue(mockSubscription);
      mockRepository.remove.mockResolvedValue(mockSubscription);

      await service.remove('123', 'user-1');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockSubscription);
    });
  });
});

