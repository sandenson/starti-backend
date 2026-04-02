import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PG_DB_NAME: Joi.string().required(),
        PG_PASSWORD: Joi.string().required(),
        PG_USER: Joi.string().required(),
        PG_PORT: Joi.number().port().default(5432),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
