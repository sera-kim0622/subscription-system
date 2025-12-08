import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { Product } from '../product/entities/product.entity';
import { PurchaseInputDto, PurchaseOutputDto } from './dto/purchase.dto';
import { PortOneResult } from './portone/portone.types';
import { SubscriptionService } from '../subscription/subscription.service';
import { Subscription } from '../subscription/entities/subscription.entity';
import { Payment } from './entities/payment.entity';
import { UserService } from '../../user/user.service';
import { PAYMENT_STATUS } from './entities/payment.status';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly paymentRepository: Repository<Payment>,
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  /**
   * @description 결제 후 구독생성하는 함수
   */
  async purchase(
    dto: PurchaseInputDto,
    userId: number,
  ): Promise<PurchaseOutputDto> {
    const { productId, simulate } = dto;

    // 1. 현재 판매중인 상품인지 확인
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('존재하지 않는 상품입니다.');
    }

    // 2. 현재 유료 구독을 하고 있는지 확인
    const user = await this.userService.getUser(userId);

    if (!user) {
      throw new UnauthorizedException('유저 정보가 확인되지 않습니다.');
    }

    const paidSubscription =
      await this.subscriptionService.getCurrentSubscription(userId);

    if (paidSubscription) {
      throw new BadRequestException('이미 구독중인 상품이 있습니다.');
    }

    // ===== mock 결제 모델 만드는 로직 =====
    const isFail = simulate === 'fail';
    const pgPaymentId = randomUUID();

    const pgPaymentResult: PortOneResult = isFail
      ? {
          status: PAYMENT_STATUS.FAIL,
          failReason: 'SIMULATED_FAILURE',
        }
      : {
          pgPaymentId,
          status: PAYMENT_STATUS.SUCCESS,
          paidAt: new Date().toISOString(),
        };
    // ===== mock 결제 모델 만드는 로직 =====

    // 3. mock 결제 정보 payment 테이블에 저장
    const paymentObject = this.paymentRepository.create({
      user,
      pgPaymentId: pgPaymentResult.pgPaymentId,
      status: pgPaymentResult.status,
      amount: product.price,
      paymentDate: pgPaymentResult.paidAt ?? null,
      issuedSubscription: false,
    });

    const result = pgPaymentResult;

    let paymentResult: Payment;
    try {
      paymentResult = await this.paymentRepository.save(paymentObject);
    } catch (error) {
      throw new BadRequestException('결제 내역 저장에 실패했습니다.');
    }

    // 3. 결제 정보 받은 후 결과 반환
    // 결제 성공의 경우 : 구독 생성, 구독권과 결제 내역 반환
    // 결제 실패의 경우 : 결제 내역 반환
    if (paymentResult.status === PAYMENT_STATUS.SUCCESS) {
      let subscription: Subscription;
      try {
        subscription = await this.subscriptionService.createSubscription({
          userId,
          productId,
          period: product.type,
          paymentId: 1,
        });
      } catch (error) {
        for await (const per of [1, 2, 3]) {
          try {
            subscription = await this.subscriptionService.createSubscription({
              userId,
              productId,
              period: product.type,
              paymentId: 1,
            });
          } catch (error) {
            console.log(`${per}회 구독권 발급 시도 중`);
            continue;
          }
        }
      }

      return {
        order: {
          productId: product.id,
          name: product.name,
          type: product.type,
          price: product.price,
        },
        payment: paymentResult,
        subscription: subscription ?? null,
        issuedSubscriptionResult: subscription
          ? '결제 완료 후 구독권 발급에 성공하였습니다.'
          : '결제는 성공하였으나 구독권 발급에 실패하였습니다.',
      };
    } else if (paymentResult.status === PAYMENT_STATUS.FAIL) {
      return {
        order: {
          productId: product.id,
          name: product.name,
          type: product.type,
          price: product.price,
        },
      };
    }
  }
}
