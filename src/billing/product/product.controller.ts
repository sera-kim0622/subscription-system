import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetProductsDto } from './dto/get-products.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * GET /products
   * 예) /products?type=MONTHLY&sortBy=price&order=ASC
   */
  @Get()
  getProducts(@Query() query: GetProductsDto) {
    return this.productService.findAll(query);
  }
}
