import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { GetProductsDto } from './dto/get-products.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(query: GetProductsDto) {
    const { type, sortBy = 'createdAt', order = 'DESC' } = query;

    const result = await this.productRepository.find({
      where: { type },
      order: { [sortBy]: order },
    });

    if (result.length === 0) {
      throw new NotFoundException('아직 상품이 등록되어있지 않습니다.');
    }

    return { result };
  }
}
