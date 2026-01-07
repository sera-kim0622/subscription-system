import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'sera@gmail.com' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8, { message: '비밀번호는 8자리 이상이어야 합니다.' })
  password: string;

  @ApiProperty({ enum: ['USER', 'ADMIN'] })
  @IsEnum(UserRole)
  role: UserRole;
}
