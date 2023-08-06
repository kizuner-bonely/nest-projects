import { Controller, Get } from '@nestjs/common';
import nodemailer from 'nodemailer';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('send')
  send() {
    return this.appService.send();
  }

  @Get('get')
  get() {
    return this.appService.get();
  }

  @Get('getMail')
  getMail() {
    return this.appService.getMail();
  }
}
