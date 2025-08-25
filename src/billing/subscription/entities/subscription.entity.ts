import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Index,
} from 'typeorm';
import { CoreEntity } from 'src/common/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/billing/product/entities/product.entity';
import { Payment } from 'src/billing/payment/entities/payment.entity';

@Entity()
export class Subscription extends CoreEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 상품(부모)을 먼저 지운 후 구독을 지울 수 있음
  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // 결제(부모)를 먼저 지운 후 구독을 지울 수 있음. 보통 결제는 이와 상관없이 지울 수 없도록 함
  @OneToOne(() => Payment, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'payment_id' })
  @Index('uq_subscription_payment_id', { unique: true }) // DB에서 유일성 보장(안전)
  payment: Payment;

  @Column({ type: 'timestamp' })
  expiredAt: Date;
}
