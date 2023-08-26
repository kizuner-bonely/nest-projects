import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'src/.env' }),
    TypeOrmModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: config.get('databaseUsername'),
          password: config.get('databasePassword'),
          database: 'loginByEmail',
          synchronize: true,
          logging: true,
          entities: [User],
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
    EmailModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
