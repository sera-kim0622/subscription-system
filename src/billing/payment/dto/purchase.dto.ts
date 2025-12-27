import { IsIn, IsNotEmpty } from 'class-validator';
import { PeriodType } from '../../subscription/types';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Payment } from '../entities/payment.entity';
import { PortOneResult } from '../portone/portone.types';

export class PurchaseInputDto {
  /** 구매할 상품 ID */
  @ApiProperty({ example: 6, description: '상품 ID(숫자)' })
  @IsNotEmpty()
  productId: number;

  /** 모킹 시나리오 (기본: success) */
  @ApiProperty({ example: 'success', description: 'success or fail' })
  @IsIn(['success', 'fail'])
  simulate?: 'success' | 'fail';
}

export class PurchaseOrderResult {
  productId: number;
  name: string;
  type: PeriodType;
  price: number;
}

export class PurchasePaymentOutput extends PickType(Payment, [
  'id',
  'pgPaymentId',
  'status',
  'amount',
  'paymentDate',
  'issuedSubscription',
  'createdAt',
]) {}

export class PurchaseOutputDto {
  order: PurchaseOrderResult;
  payment?: PurchasePaymentOutput | null;
  subscription?: Subscription | null;
  resultMessage: string;
  pgPaymentResult: PortOneResult;
}
