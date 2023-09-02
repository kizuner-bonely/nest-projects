import { InjectEntityManager } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { Article } from './entities/article.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ArticleService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @Inject()
  private redisService: RedisService;

  async findOne(id: number) {
    return await this.entityManager.findOneBy(Article, { id });
  }

  async view(id: number, userId: string) {
    const res = await this.redisService.hashGet(`article_${id}`);

    if (res.viewCount === undefined) {
      const article = await this.findOne(id);
      article.viewCount++;
      await this.entityManager.update(
        Article,
        { id },
        {
          viewCount: article.viewCount,
        },
      );
      await this.redisService.hashSet(`article_${id}`, {
        viewCount: article.viewCount,
        likes: article.likes,
        collect: article.collect,
      });

      await this.redisService.set(`user_${userId}_article_${id}`, 1, 6);

      return article.viewCount;
    } else {
      const flag = await this.redisService.get(`user_${userId}_article_${id}`);

      if (flag) return res.viewCount;

      await this.redisService.hashSet(`article_${id}`, {
        ...res,
        viewCount: +res.viewCount + 1,
      });

      await this.redisService.set(`user_${userId}_article_${id}`, 1, 6);

      return +res.viewCount + 1;
    }
  }

  async flushRedisToDB() {
    const keys = await this.redisService.keys(`article_*`);

    keys.forEach(async (key) => {
      const res = await this.redisService.hashGet(key);
      const [, id] = key.split('_');

      await this.entityManager.update(
        Article,
        { id: +id },
        { viewCount: +res.viewCount },
      );
    });
  }
}
