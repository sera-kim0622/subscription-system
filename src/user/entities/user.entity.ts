import { Entity, Column, OneToMany } from 'typeorm';
import { CoreEntity } from 'src/common/core.entity';
import { Subscription } from 'src/billing/subscription/entities/subscription.entity';
import { Payment } from 'src/billing/payment/entities/payment.entity';

@Entity('user')
export class User extends CoreEntity {
  @Column({ type: 'varchar', length: 255, unique: true, name: 'email' })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password' })
  password: string;

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => Payment, (p) => p.user)
  payments: Payment[];
}
