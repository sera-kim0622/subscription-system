import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from '../subscription/subscription.service';
import { PaymentService } from './payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Payment } from './entities/payment.entity';
import { UserService } from '../../user/user.service';
import { NotFoundException } from '@nestjs/common';
import { PeriodType } from '../subscription/types';

let paymentService: PaymentService;
let paymentRepository: any;
let productRepository: any;
let userService: any;
let subscriptionService: any;

beforeEach(async () => {
  productRepository = {
    findOne: jest.fn(),
  };

  paymentRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  userService = {
    getUser: jest.fn(),
  };

  subscriptionService = {
    getCurrentSubscription: jest.fn(),
    createSubscription: jest.fn(),
  };

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      PaymentService,
      {
        provide: getRepositoryToken(Product),
        useValue: productRepository,
      },
      {
        provide: getRepositoryToken(Payment),
        useValue: productRepository,
      },
      {
        provide: UserService,
        useValue: userService,
      },
      {
        provide: SubscriptionService,
        useValue: subscriptionService,
      },
    ],
  }).compile();

  paymentService = module.get<PaymentService>(PaymentService);
});

describe('결제 함수(purchase) 테스트', () => {
  it('결제하려는 상품이 존재하지 않을 경우 에러를 반환', async () => {
    productRepository.findOne.mockResolvedValue(undefined);

    const result = paymentService.purchase(
      {
        productId: 1,
        simulate: 'success',
      },
      1,
    );

    await expect(result).rejects.toThrow(Error);
  });

  it('결제하려는 유저가 존재하지 않을 경우 에러를 반환', async () => {
    productRepository.findOne.mockResolvedValue({ id: 1 });

    userService.getUser.mockImplementation(() => {
      throw new NotFoundException('유저 없음');
    });

    const result = paymentService.purchase(
      {
        productId: 1,
        simulate: 'success',
      },
      1,
    );

    expect(productRepository.findOne).toHaveBeenCalledTimes(1);
    await expect(result).rejects.toThrow(Error);
  });

  it('이미 구독중인 상품이 있는 경우 에러를 반환', async () => {
    productRepository.findOne.mockResolvedValue({
      id: 1,
      name: 'BASIC',
      type: PeriodType.MONTHLY,
      price: 3000,
    });

    userService.getUser.mockResolvedValue({ id: 1, email: 'sera@gmail.com' });
    subscriptionService.getCurrentSubscription.mockResolvedValue({
      id: 1,
      user: { id: 1 },
      product: { id: 1 },
      payment: { id: 1 },
      expiredAt: new Date(),
    });

    const result = paymentService.purchase(
      {
        productId: 1,
        simulate: 'success',
      },
      1,
    );

    expect(productRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userService.getUser).toHaveBeenCalledTimes(1);
    expect(subscriptionService.getCurrentSubscription).toHaveBeenCalledTimes(1);
    await expect(result).rejects.toThrow(Error);
  });

  it('결제 결과를 받은 후 결제 테이블에 저장하다가 실패', async () => {});

  it('결제 성공 후 구독권을 생성하다가 실패 => 구독권 발급 3회 시도 중 성공', async () => {});

  it('결제 성공 후 구독권을 생성하다가 실패 => 구독권 발급 3회 시도 모두 실패', async () => {});

  it('결제 성공 후 구독권을 생성하여 결제, 구독정보 반환', async () => {});

  it('결제 실패하여 결제 정보를 반환', async () => {});
});
