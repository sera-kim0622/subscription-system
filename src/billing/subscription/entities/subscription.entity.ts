import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { CoreEntity } from 'src/common/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/billing/product/entities/product.entity';
import { Payment } from 'src/billing/payment/entities/payment.entity';

@Entity()
export class Subscription extends CoreEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToOne(() => Payment, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @Column({ type: 'timestamp' })
  expiredAt: Date;
}
