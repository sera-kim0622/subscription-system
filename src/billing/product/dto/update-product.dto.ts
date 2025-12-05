import { PartialType } from '@nestjs/swagger';
import { CreateProductInputDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductInputDto) {}
