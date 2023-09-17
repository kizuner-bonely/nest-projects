import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { User } from './user/entities/user.entity'
import { Role } from './user/entities/role.entity'
import { Permission } from './user/entities/permission.entity'
import { RedisModule } from './redis/redis.module'
import { EmailModule } from './email/email.module'
import { LoginGuard } from './login.guard'
import { PermissionGuard } from './permission.guard'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'src/.env' }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: configService.get('jwt_access_token_expires_time'),
          },
        }
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: 'localhost',
          database: 'conference',
          port: 3307,
          username: configService.get('databaseUsername'),
          password: configService.get('databasePassword'),
          synchronize: true,
          logging: true,
          entities: [User, Role, Permission],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        }
      },
      inject: [ConfigService],
    }),
    UserModule,
    RedisModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
