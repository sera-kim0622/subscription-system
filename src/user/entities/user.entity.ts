import { Entity, Column, OneToMany, BeforeInsert } from 'typeorm';
import { CoreEntity } from 'src/common/core.entity';
import { Subscription } from 'src/billing/subscription/entities/subscription.entity';
import { Payment } from 'src/billing/payment/entities/payment.entity';

import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity('user')
export class User extends CoreEntity {
  @Column({ type: 'varchar', length: 255, unique: true, name: 'email' })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password', select: false })
  password: string;

  @Column({ type: 'varchar', length: 100, name: 'role' })
  role: UserRole;

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => Payment, (p) => p.user)
  payments: Payment[];

  @BeforeInsert()
  private async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }
}
