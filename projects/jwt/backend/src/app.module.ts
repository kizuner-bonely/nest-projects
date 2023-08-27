import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from './user/entities/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';

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
          database: 'login_jwt',
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
    JwtModule.register({
      global: true,
      secret: 'hh',
      signOptions: { expiresIn: '7d' },
    }),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory(config: ConfigService) {
    //     return {
    //       global: true,
    //       secret: config.get('jwtSecret'),
    //       signOptions: { expiresIn: '7d' },
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
