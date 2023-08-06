import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

import Mail from './mail';

@Injectable()
export class AppService {
  private mail = new Mail();

  constructor(private configService: ConfigService) {}

  getHello(): string {
    const email = this.configService.get('email');
    return `模拟邮件接发 ${email}`;
  }

  private getHtml() {
    const filePath = path.resolve(__dirname, '..', 'public', 'button.html');
    const html = fs.readFileSync(filePath);
    return html;
  }

  send() {
    const email = this.configService.get('email');
    const emailAuth = this.configService.get('emailAuth');

    return this.mail
      .send(
        this.mail.createTransport(email, emailAuth),
        `"HH" <${email}>`,
        email,
        this.getHtml(),
      )
      .then(() => {
        return '邮件发送成功';
      })
      .catch(() => {
        return '邮件发送失败';
      });
  }
}
