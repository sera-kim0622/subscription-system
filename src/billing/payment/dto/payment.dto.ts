import { TransformDate } from '../../../common/decorators/date.format';
import { Payment } from '../entities/payment.entity';
import { PAYMENT_STATUS } from '../entities/payment.status';

export class PaymentOutput {
  id: number;

  status: PAYMENT_STATUS;

  amount: number;

  pgPaymentId: string;

  @TransformDate('datetime')
  paymentDate: Date;

  issuedSubscription: boolean;

  constructor(payment: Payment) {
    this.id = payment.id;
    this.status = payment.status;
    this.amount = payment.amount;
    this.pgPaymentId = payment.pgPaymentId;
    this.paymentDate = payment.paymentDate;
    this.issuedSubscription = payment.issuedSubscription;
  }
}
