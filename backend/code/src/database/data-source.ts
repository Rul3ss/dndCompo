import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../user/entities/user.entity';

ConfigModule.forRoot({ isGlobal: true });

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  synchronize: false,
});
