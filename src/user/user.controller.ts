import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signUp(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    // 필요 시 반환에서 password 제거
    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.userService.login(dto);
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
