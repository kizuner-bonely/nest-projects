import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';

import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';

@Global()
@Module({
  controllers: [RedisController],
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
