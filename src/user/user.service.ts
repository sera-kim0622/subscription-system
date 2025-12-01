import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const exists = await this.repo.findOne({ where: { email: dto.email } });
      if (exists) throw new ConflictException('Email already in use');

      const hashed = await bcrypt.hash(dto.password, 12);
      const user = this.repo.create({ email: dto.email, password: hashed });
      return this.repo.save(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new Error('회원가입 도중 알 수 없는 에러가 발생하였습니다.');
    }
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async findMe(userId: string) {
    // 구독 정보를 함께 로드 (left join)
    return this.repo.findOne({
      where: { id: userId },
      relations: { subscriptions: true },
    });
  }
}
