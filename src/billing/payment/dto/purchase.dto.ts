import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class PurchaseInputDto {
  /** 구매할 상품 ID */
  @IsNotEmpty()
  productId: number;

  /** 모킹 시나리오 (기본: success) */
  @IsOptional()
  @IsIn(['success', 'fail'])
  simulate?: 'success' | 'fail';
}

export class PurchaseOutputDto {
  
}
