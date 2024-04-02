import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_configService: ConfigService) => ({
        type: 'postgres',
        host: _configService.get<string>('DB_HOST'),
        port: _configService.get<number>('DB_PORT'),
        username: _configService.get<string>('DB_USERNAME'),
        password: _configService.get<string>('DB_PASSWORD'),
        database: _configService.get<string>('DB_DATABASE'),
        entities: [],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
