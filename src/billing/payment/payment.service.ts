import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { Product } from '../product/entities/product.entity';
import { PurchaseDto } from './dto/purchase.dto';
import { PortOneResult } from './portone/portone.types';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  /** 모킹: PortOne 호출 대신 내부에서 결과 생성 */
  async purchase(dto: PurchaseDto, userId: number) {
    const { productId, simulate } = dto;

    // 존재하는 상품인지 확인
    const product = await this.productRepo.findOne({
      where: { id: productId } as any,
    });

    if (!product) {
      throw new NotFoundException('존재하지 않는 상품입니다.');
    }

    // 모킹 결제 결과 만들기 (최소 스키마)
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

    // 성공인 경우 결제 생성 -> 구독 생성(한 건당 한 번)
    if (result.status === 'PAID') {
      const subscription = await this.subscriptionService.createSubscription({
        userId,
        productId,
        period: product.type as 'MONTHLY' | 'YEARLY',
        paymentId: 1,
      });

      return {
        provider: 'PORTONE_MOCK',
        result,
        order: {
          productId: product.id,
          name: product.name,
          type: product.type,
          price: product.price,
        },
        subscription,
      };
    }
    // ✅ MVP: DB 기록/구독 활성화 없음. 오직 결과만 반환
    return {
      provider: 'PORTONE_MOCK',
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
