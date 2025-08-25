import { Entity, Column } from 'typeorm';
import { CoreEntity } from 'src/common/core.entity';
import { PAYMENT_STATUS } from './payment.status';

@Entity()
export class Payment extends CoreEntity {
  @Column({ type: 'uuid', length: 255 })
  pgPaymentId: string;

  @Column({ type: 'varchar', length: 50 })
  status: PAYMENT_STATUS;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'timestamp' })
  paymentDate: Date;
}
