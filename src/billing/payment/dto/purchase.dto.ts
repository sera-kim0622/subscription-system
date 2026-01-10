import { IsIn, IsNotEmpty } from 'class-validator';
import { PeriodType } from '../../subscription/types';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Payment } from '../entities/payment.entity';
import { PortOneResult } from '../portone/portone.types';
import { SubscriptionOutputDto } from '../../subscription/dtos/subscription.dto';
import { PaymentOutput } from './payment.dto';

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

export class PurchaseOutputDto {
  order: PurchaseOrderResult;
  payment?: PaymentOutput | null;
  subscription?: SubscriptionOutputDto | null;
  resultMessage: string;

  constructor(partial: Partial<PurchaseOutputDto>) {
    Object.assign(this, partial);
  }
}
