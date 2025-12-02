import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class GetUserOutputDto extends PickType(User, [
  'email',
  'payments',
  'subscriptions',
] as const) {}
