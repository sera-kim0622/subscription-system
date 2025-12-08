import { Entity, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { CoreEntity } from 'src/common/core.entity';
import { PAYMENT_STATUS } from './payment.status';
import { Subscription } from 'src/billing/subscription/entities/subscription.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Payment extends CoreEntity {
  @OneToOne(() => Subscription, (s) => s.payment)
  subscription: Subscription;

  @ManyToOne(() => User, (u) => u.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  userEmail: string;

  @Column({ type: 'uuid' })
  pgPaymentId: string;

  @Column({ type: 'varchar', length: 50 })
  status: PAYMENT_STATUS;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'timestamp' })
  paymentDate: Date;

  @Column({ type: 'boolean' })
  issuedSubscription: boolean;
}
