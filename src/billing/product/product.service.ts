import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { GetProductsDto } from './dto/get-products.dto';
import { CreateProductInputDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts(query: GetProductsDto) {
    const { type, sortBy = 'createdAt', order = 'DESC' } = query;

    const result = await this.productRepository.find({
      where: { type },
      order: { [sortBy]: order },
    });

    return { result };
  }

  async createProduct(body: CreateProductInputDto): Promise<Product> {
    const { name, type, price } = body;

    const object = this.productRepository.create({ name, type, price });
    try {
      return await this.productRepository.save(object);
    } catch (error) {
      throw new InternalServerErrorException(
        '상품을 DB에 저장하던 중 오류가 발생하였습니다.',
      );
    }
  }
}
