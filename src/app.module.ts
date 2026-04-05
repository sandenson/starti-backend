import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/entities/comment.entity';
import { Post } from './post/entities/post.entity';
import { PostModule } from './post/post.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ENVIRONMENT: Joi.string().valid('dev', 'test', 'prod').default('dev'),
        PG_DB_NAME: Joi.string().required(),
        PG_PASSWORD: Joi.string().required(),
        PG_USER: Joi.string().required(),
        PG_PORT: Joi.number().port().default(5432),
        PG_HOST: Joi.string().default('localhost'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('PG_HOST'),
        port: config.get('PG_PORT'),
        username: config.get('PG_USER'),
        password: config.get('PG_PASSWORD'),
        database: config.get('PG_DB_NAME'),
        entities: [User, Post, Comment],
        synchronize: !(config.get('PG_DB_NAME') == 'prod'),
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    PostModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
