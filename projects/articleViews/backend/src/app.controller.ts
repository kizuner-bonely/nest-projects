import { InjectEntityManager } from '@nestjs/typeorm';
import { Controller, Get } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { Article } from './article/entities/article.entity';

@Controller()
export class AppController {
  @InjectEntityManager()
  private entityManager: EntityManager;

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('init-data')
  async initData() {
    await Promise.all([
      this.entityManager.save(User, { username: 'aaa', password: '111111' }),
      this.entityManager.save(User, { username: 'bbb', password: '222222' }),
      this.entityManager.save(Article, {
        title: '上班有点累',
        content: '发发牢骚',
      }),
    ]);
  }
}
