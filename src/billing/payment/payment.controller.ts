import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { PurchaseInputDto } from './dto/purchase.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator.ts';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: '구독 상품 구매 (PortOne 모킹)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('purchase')
  purchase(@Body() dto: PurchaseInputDto, @CurrentUser('id') userId: number) {
    return this.paymentService.purchase(dto, userId);
  }
}
