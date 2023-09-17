import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient } from 'redis'

import { RedisService } from './redis.service'

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get('redis_host'),
            port: configService.get('redis_port'),
          },
          database: 1,
        })
        await client.connect()
        return client
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
