import { Module } from '@nestjs/common';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';

@Module({
  controllers: [PaymentController, SubscriptionController],
  providers: [PaymentService, SubscriptionService],
})
export class BillingModule {}
