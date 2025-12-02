import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { GetUserOutputDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const exists = await this.userRepo.findOne({
        where: { email: dto.email },
      });
      if (exists) throw new ConflictException('Email already in use');

      // const hashed = await bcrypt.hash(dto.password, 12);
      const user = this.userRepo.create({
        email: dto.email,
        password: dto.password,
      });
      return this.userRepo.save(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new Error('회원가입 도중 알 수 없는 에러가 발생하였습니다.');
    }
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = dto;
    try {
      const user = await this.userRepo.findOne({ where: { email } });

      if (!user) {
        throw new UnauthorizedException('존재하지 않는 이메일입니다.');
      }

      const passwordConfirm = await bcrypt.compare(password, user.password);
      if (!passwordConfirm) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }

      let accessToken;
      try {
        accessToken = await this.jwt.signAsync({
          sub: user.id,
          email: user.email,
        });
      } catch (error) {
        throw new InternalServerErrorException(
          'JWT 에러 : 환경설정 및 payload값을 확인해주세요.',
        );
      }

      return { accessToken };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new Error('로그인 중 알 수 없는 에러가 발생하였습니다.');
    }
  }

  getUser(userId: string): Promise<GetUserOutputDto> {
    const user = this.userRepo.findOne({
      where: { id: userId },
      relations: { subscriptions: true, payments: true },
    });
    return user;
  }
}
