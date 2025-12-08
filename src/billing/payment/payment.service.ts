import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { Product } from '../product/entities/product.entity';
import { PurchaseInputDto, PurchaseOutputDto } from './dto/purchase.dto';
import { PortOneResult } from './portone/portone.types';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
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
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('존재하지 않는 상품입니다.');
    }

    // ===== 가짜 결제 모델 만드는 로직 =====
    const isFail = simulate === 'fail';
    const pgPaymentId = randomUUID();

    const result: PortOneResult = isFail
      ? {
          status: 'FAILED',
          failReason: 'SIMULATED_FAILURE',
        }
      : {
          pgPaymentId,
          status: 'PAID',
          paidAt: new Date().toISOString(),
        };

    // 결제 성공의 경우 : 구독 생성, 구독권과 결제 내역 반환
    // 결제 실패의 경우 : 결제 내역 반환
    if (result.status === 'PAID') {
      const subscription = await this.subscriptionService.createSubscription({
        userId,
        productId,
        period: product.type,
        paymentId: 1,
      });

      return {
        result,
        order: {
          productId: product.id,
          name: product.name,
          type: product.type,
          price: product.price,
        },
        subscription,
      };
    } else {
      return {
        result,
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
