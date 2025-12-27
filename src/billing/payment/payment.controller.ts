import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { PurchaseInputDto, PurchaseOutputDto } from './dto/purchase.dto';
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
  purchase(
    @Body() dto: PurchaseInputDto,
    @CurrentUser('id') userId: number,
  ): Promise<PurchaseOutputDto> {
    return this.paymentService.purchase(dto, userId);
  }

  @ApiOperation({ summary: '구독 상품 구매 (PortOne 모킹)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refund') // 환불 과정은 취소한 행위에 대한 새로운 처리이므로 관용적으로 post를 주로 사용, 결제대행사들도 모두 post를 사용함
  refund() {}
}
