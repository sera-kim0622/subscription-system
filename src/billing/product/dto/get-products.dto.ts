import { IsIn, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetProductsDto {
  @ApiPropertyOptional({
    enum: ['MONTHLY', 'YEARLY'],
    description: '상품 타입',
  })
  @IsOptional()
  @IsIn(['MONTHLY', 'YEARLY'])
  type?: 'MONTHLY' | 'YEARLY';

  @ApiPropertyOptional({
    enum: ['createdAt', 'price', 'name'],
    description: '정렬 컬럼',
  })
  @IsOptional()
  @IsIn(['createdAt', 'price', 'name'])
  sortBy?: 'createdAt' | 'price' | 'name';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], description: '정렬 방향' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
}
