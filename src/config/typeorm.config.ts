import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  autoLoadEntities: true, // 모듈에 등록된 엔티티 자동 로드
  entities: ['dist/**/*.entity.{js,ts}'],
  migrations: ['dist/migrations/*.{js,ts}'],
  synchronize: false,
  logging: configService.get<string>('NODE_ENV') !== 'production',
  namingStrategy: new SnakeNamingStrategy(),
});
