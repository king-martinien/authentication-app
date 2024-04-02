import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { configValidationSchema } from '../schema/config-validation.schema';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: [`environment/.env.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
