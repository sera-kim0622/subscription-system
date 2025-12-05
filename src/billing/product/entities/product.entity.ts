import { Entity, Column } from 'typeorm';
import { CoreEntity } from 'src/common/core.entity';
import { PeriodType } from '../../subscription/types';
@Entity()
export class Product extends CoreEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  type: PeriodType; // 월간, 연간 구독 형태 택일

  @Column({ type: 'int' })
  price: number;
}
