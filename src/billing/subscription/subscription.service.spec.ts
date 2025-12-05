import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './entities/subscription.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { PeriodType } from './types';

let subscriptionService: SubscriptionService;
let subscriptionRepository;
let productRepository;

beforeEach(async () => {
  subscriptionRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  productRepository = {
    findOne: jest.fn(),
  };

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      SubscriptionService,
      {
        provide: getRepositoryToken(Subscription),
        useValue: subscriptionRepository,
      },
      {
        provide: getRepositoryToken(Product),
        useValue: productRepository,
      },
    ],
  }).compile();

  subscriptionService = module.get<SubscriptionService>(SubscriptionService);
});

describe('결제 후 구독생성하는 함수 테스트', () => {
  it('동일 결제 id로 생성된 구독이 있으면 상태코드 409 에러를 반환', async () => {
    subscriptionRepository.findOne.mockResolvedValue({ id: 1 });
    const input = {
      userId: 1,
      productId: 1,
      period: PeriodType.MONTHLY,
      paymentId: 1,
    };

    const result = subscriptionService.createSubscription(input);
    await expect(result).rejects.toThrow(Error);
    await expect(result).rejects.toMatchObject({ status: 409 });
  });

  it('존재하지 않는 상품일 경우 상태코드 404 에러를 반환', async () => {
    subscriptionRepository.findOne.mockResolvedValue(undefined);
    productRepository.findOne.mockResolvedValue(undefined);
    const input = {
      userId: 1,
      productId: 1,
      period: PeriodType.MONTHLY,
      paymentId: 1,
    };

    const result = subscriptionService.createSubscription(input);
    await expect(result).rejects.toThrow(Error);
    await expect(result).rejects.toMatchObject({ status: 404 });
  });

  it('구독 객체 생성 중 오류가 발생되면 에러를 반환', async () => {
    subscriptionRepository.findOne.mockResolvedValue(undefined);
    productRepository.findOne.mockResolvedValue({ id: 1 });

    // 가짜 날짜 만들어야 함
    const fakeTime = new Date(2025, 12, 4, 20, 36);
    jest.useFakeTimers().setSystemTime(fakeTime);
    subscriptionService._calculateExpirationDate(fakeTime, PeriodType.MONTHLY);

    // subscriptionService._calculateExpirationDate(startDate, PeriodType.MONTHLY);
    const input = {
      userId: 1,
      productId: 1,
      period: PeriodType.MONTHLY,
      paymentId: 1,
    };
    subscriptionRepository.save.mockRejectedValue(new Error());

    const result = subscriptionService.createSubscription(input);
    await expect(result).rejects.toThrow(Error);
  });

  it('월 구독이 성공적으로 생성되어 구독 정보를 반환', async () => {
    subscriptionRepository.findOne.mockResolvedValue(undefined);
    productRepository.findOne.mockResolvedValue({ id: 1 });

    // 가짜 날짜 생성
    const fakeTime = new Date(2025, 11, 4, 20, 36);
    jest.useFakeTimers().setSystemTime(fakeTime);

    // 객체 생성
    subscriptionRepository.create.mockImplementation((data) => data);
    subscriptionRepository.save.mockImplementation(async (sub) => {
      return { ...sub, id: 1 };
    });

    const input = {
      userId: 1,
      productId: 1,
      period: PeriodType.MONTHLY,
      paymentId: 1,
    };

    const result = await subscriptionService.createSubscription(input);

    // 한 달 후의 날짜가 유효기간으로 설정된 구독권이 발급되었는지 확인
    const expected = new Date(fakeTime);
    expected.setMonth(expected.getMonth() + 1);
    expect(result.expiredAt.getFullYear()).toBe(expected.getFullYear());
    expect(result.expiredAt.getMonth()).toBe(expected.getMonth());
    expect(result.expiredAt.getDate()).toBe(expected.getDate());
  });
});
