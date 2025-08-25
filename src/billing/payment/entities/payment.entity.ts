import { Entity, Column, OneToOne } from 'typeorm';
import { CoreEntity } from 'src/common/core.entity';
import { PAYMENT_STATUS } from './payment.status';
import { Subscription } from 'src/billing/subscription/entities/subscription.entity';

@Entity()
export class Payment extends CoreEntity {
  @OneToOne(() => Subscription, (s) => s.payment)
  subscription: Subscription;

  @Column({ type: 'uuid' })
  pgPaymentId: string;

  @Column({ type: 'varchar', length: 50 })
  status: PAYMENT_STATUS;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'timestamp' })
  paymentDate: Date;
}
