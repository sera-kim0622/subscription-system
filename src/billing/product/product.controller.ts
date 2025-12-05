import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetProductsDto } from './dto/get-products.dto';
import { ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { CreateProductInputDto } from './dto/create-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * GET /products
   * 예) /products?type=MONTHLY&sortBy=price&order=ASC
   */
  @Get()
  getProducts(@Query() query: GetProductsDto) {
    return this.productService.getProducts(query);
  }

  @Post()
  async createProduct(@Body() body: CreateProductInputDto): Promise<Product> {
    return await this.productService.createProduct(body);
  }
}
