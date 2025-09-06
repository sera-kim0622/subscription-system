import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { PurchaseDto } from './dto/purchase.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: '구독 상품 구매 (PortOne 모킹)' })
  @Post('purchase')
  purchase(@Body() dto: PurchaseDto) {
    return this.paymentService.purchase(dto);
  }
}
