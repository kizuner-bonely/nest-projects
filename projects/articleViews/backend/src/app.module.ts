import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { ArticleModule } from './article/article.module';
import { Article } from './article/entities/article.entity';
import { RedisModule } from './redis/redis.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'src/.env' }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          port: 3306,
          type: 'mysql',
          host: 'localhost',
          database: 'article_views',
          username: configService.get('databaseUsername'),
          password: configService.get('databasePassword'),
          synchronize: true,
          logging: true,
          entities: [User, Article],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    ArticleModule,
    RedisModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
