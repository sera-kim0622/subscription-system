import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../user/entities/user.entity';
import { cookieExtractor } from './functions/cookie-extractor';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.JWT_SECRET || 'dev_secret',
    });
  }
  async validate(payload: { sub: string; email: string; role: UserRole }) {
    return {
      userId: Number(payload.sub),
      email: payload.email,
      role: payload.role,
    };
  }
}
