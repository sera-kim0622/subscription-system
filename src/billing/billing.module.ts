import { Module } from '@nestjs/common';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { Product } from './product/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './subscription/entities/subscription.entity';
import { Payment } from './payment/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Subscription, Payment])],
  controllers: [PaymentController, SubscriptionController, ProductController],
  providers: [PaymentService, SubscriptionService, ProductService],
})
export class BillingModule {}
