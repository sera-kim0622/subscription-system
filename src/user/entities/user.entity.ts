import { Entity, Column } from 'typeorm';
import { CoreEntity } from 'src/common/core.entity';

@Entity('user')
export class User extends CoreEntity {
  @Column({ type: 'varchar', length: 255, unique: true, name: 'email' })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password' })
  password: string;
}
