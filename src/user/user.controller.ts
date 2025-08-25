// src/user/users.controller.ts
import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  @Post()
  async signUp(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    // 필요 시 반환에서 password 제거
    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.userService.validateUser(dto.email, dto.password);
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return { accessToken: token };
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    const me = await this.userService.findMe(req.user.userId);
    // password 제외
    const { password, ...safe } = me ?? {};
    return safe;
  }
}
