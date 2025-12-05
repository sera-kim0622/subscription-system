import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Subscription } from './entities/subscription.entity';
import { Product } from '../product/entities/product.entity';
import { CreateSubscriptionInput, PeriodType } from './types/index';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * @description 결제 후 실행되는 구독 생성 내부 함수
   * @param input 유저정보, 상품정보, 결제정보
   * @returns
   */
  async createSubscription(
    input: CreateSubscriptionInput,
  ): Promise<Subscription> {
    const { userId, productId, period, paymentId } = input;

    // 동일 거래 중복 방지
    const duplicateSubscription = await this.subscriptionRepository.findOne({
      where: { payment: paymentId } as any,
    });

    if (duplicateSubscription) {
      throw new ConflictException('해당 결제의 구독이 이미 생성되었습니다.');
    }

    // product 존재 확인
    const product = await this.productRepository.findOne({
      where: { id: productId } as any,
    });

    if (!product) throw new NotFoundException('존재하지 않는 상품입니다.');

    // 구독의 유효기간 설정
    const startedAt = new Date();
    const expiredAt = this._calculateExpirationDate(startedAt, period);

    // 구독 객체 생성
    const subscription = this.subscriptionRepository.create({
      userId,
      productId,
      expiredAt,
    } as any);

    const result = (await this.subscriptionRepository.save(
      subscription,
    )) as unknown as Subscription;

    return result;
  }

  /**
   * 월간/연간에 따라 시작일로부터 만료 날짜 계산해주는 함수
   * @param start : 시작일
   * @param type : MONTHLY / YEARLY
   * @returns 계산된 날짜
   */
  _calculateExpirationDate(start: Date, type: PeriodType) {
    const estimateDate = new Date(start);
    if (type === 'YEARLY') {
      estimateDate.setFullYear(estimateDate.getFullYear() + 1);
    } else {
      estimateDate.setMonth(estimateDate.getMonth() + 1);
    }
    return estimateDate;
  }
}
