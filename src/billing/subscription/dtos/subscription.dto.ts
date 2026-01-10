import { TransformDate } from '../../../common/decorators/date.format';
import { Subscription } from '../entities/subscription.entity';

export class SubscriptionOutputDto {
  id: number;

  @TransformDate('date')
  expiredAt: Date;

  constructor(subscription: Subscription) {
    this.id = subscription.id;
    this.expiredAt = subscription.expiredAt;
  }
}
