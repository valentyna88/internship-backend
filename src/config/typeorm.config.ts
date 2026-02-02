import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get<string>('POSTGRES_HOST'),
  port: Number(config.get<string>('POSTGRES_PORT')),
  username: config.get<string>('POSTGRES_USER'),
  password: config.get<string>('POSTGRES_PASSWORD'),
  database: config.get<string>('POSTGRES_DB'),
  autoLoadEntities: true,
  synchronize: false,
  logging: true,
});
