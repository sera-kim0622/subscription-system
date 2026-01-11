import { IsIn, IsNotEmpty } from 'class-validator';
import { PeriodType } from '../../subscription/types';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionOutputDto } from '../../subscription/dtos/subscription.dto';
import { PaymentOutput } from './payment.dto';

export class PurchaseInputDto {
  /** 구매할 상품 ID */
  @ApiProperty({ example: 6, description: '상품 ID(숫자)' })
  @IsNotEmpty()
  productId: number;

  /** 모킹 시나리오 (기본: success) */
  @ApiProperty({ example: 'success', description: 'success or fail' })
  @IsIn(['success', 'subscription_fail', 'fail'])
  simulate?: 'success' | 'subscription_fail' | 'fail';
}

export class PurchaseOrderResult {
  productId: number;
  name: string;
  type: PeriodType;
  price: number;
}

export enum PurchaseResultStatus {
  SUCCESS = 'SUCCESS', // 결제 성공 + 구독 성공
  SUBSCRIPTION_FAILED = 'SUBSCRIPTION_FAILED', // 결제 성공 + 구독 실패
  PAYMENT_FAILED = 'PAYMENT_FAILED', // 결제 실패
}

export class PurchaseOutputDto {
  order: PurchaseOrderResult;
  payment?: PaymentOutput | null;
  subscription?: SubscriptionOutputDto | null;
  resultMessage: string;
  resultStatus: PurchaseResultStatus;

  constructor(partial: Partial<PurchaseOutputDto>) {
    Object.assign(this, partial);
  }
}
