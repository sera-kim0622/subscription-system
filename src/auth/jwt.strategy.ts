import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../user/entities/user.entity';
import { Request } from 'express';

const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies['accessToken'] || null;
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.JWT_SECRET || 'dev_secret',
    });
  }
  async validate(payload: { sub: string; email: string; role: UserRole }) {
    console.log('user', payload.email);
    return {
      userId: Number(payload.sub),
      email: payload.email,
      role: payload.role,
    };
  }
}
