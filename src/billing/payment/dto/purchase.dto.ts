import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class PurchaseDto {
  /** 구매할 상품 ID (숫자/문자열 모두 허용: DB에 맞게 파싱) */
  @IsNotEmpty()
  productId: string;

  /** 모킹 시나리오 (기본: success) */
  @IsOptional()
  @IsIn(['success', 'fail'])
  simulate?: 'success' | 'fail';
}
