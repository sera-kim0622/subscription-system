import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { Product } from '../product/entities/product.entity';
import { PurchaseDto } from './dto/purchase.dto';
import { PortOneResult } from './portone/portone.types';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  /** 모킹: PortOne 호출 대신 내부에서 결과 생성 */
  async purchase(dto: PurchaseDto) {
    const { productId, simulate } = dto;

    // productId가 숫자 PK라면 number로 파싱 시도
    const id = Number.isNaN(Number(productId)) ? productId : Number(productId);

    const product = await this.productRepo.findOne({ where: { id } as any });
    if (!product) {
      throw new NotFoundException('존재하지 않는 상품입니다.');
    }

    // 모킹 결제 결과 만들기 (최소 스키마)
    const isFail = simulate === 'fail';
    const txId = randomUUID();

    const result: PortOneResult = isFail
      ? {
          txId,
          status: 'FAILED',
          failReason: 'SIMULATED_FAILURE',
        }
      : {
          txId,
          status: 'PAID',
          paidAt: new Date().toISOString(),
        };

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
