import { createTransport, Transporter } from 'nodemailer'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class EmailService {
  private transporter: Transporter

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get('email'),
        pass: this.configService.get('emailPass'),
      },
    })
  }

  async sendEmail(emailProps: { to: string; subject: string; html: string }) {
    const { to, subject, html } = emailProps

    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: this.configService.get('email'),
      },
      to,
      subject,
      html,
    })
  }
}
