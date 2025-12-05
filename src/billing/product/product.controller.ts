import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetProductsDto } from './dto/get-products.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { CreateProductInputDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/decorator/roles.decorator';
import { UserRole } from '../../user/entities/user.entity';

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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createProduct(@Body() body: CreateProductInputDto): Promise<Product> {
    return await this.productService.createProduct(body);
  }
}
