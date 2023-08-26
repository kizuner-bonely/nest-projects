import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: configService.get('email'),
        pass: configService.get('emailAuth'),
      },
    });
  }

  async sendEmail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '系统邮件',
        address: this.configService.get('email'),
      },
      to,
      subject,
      html,
    });
  }
}
