import { IsIn, IsInt, IsString } from 'class-validator';
import { PeriodType } from '../../subscription/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductInputDto {
  @ApiProperty({ example: 'BASIC', description: '상품명' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'MONTHLY', description: '구독 기간: 월/연만 가능' })
  @IsIn(['MONTHLY', 'YEARLY'])
  type: PeriodType;

  @ApiProperty({ example: 15000, description: '가격, 숫자만 입력 가능' })
  @IsInt()
  price: number;
}
