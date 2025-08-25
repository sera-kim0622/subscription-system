import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';

@Module({
  controllers: [BillingController, PaymentController, SubscriptionController],
  providers: [BillingService, PaymentService, SubscriptionService],
})
export class BillingModule {}
