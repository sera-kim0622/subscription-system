import { Injectable, NotFoundException } from '@nestjs/common';
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
    return await this.productRepository.save(object);
  }
}
