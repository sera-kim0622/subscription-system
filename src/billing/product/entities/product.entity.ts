import { Entity, Column } from 'typeorm';
import { CoreEntity } from 'src/common/core.entity';

@Entity()
export class Product extends CoreEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  type: string; // 예: MONTHLY, YEARLY

  @Column({ type: 'int' })
  price: number;
}
