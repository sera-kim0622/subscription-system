import { IsIn, IsNotEmpty } from 'class-validator';
import { PeriodType } from '../../subscription/types';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '../entities/payment.entity';

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
  payment?: Payment | null;
  subscription?: Subscription | null;
  issuedSubscriptionResult?: string;
}
