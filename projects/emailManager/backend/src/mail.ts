import * as nodemailer from 'nodemailer';

export default class Mail {
  createTransport(email: string, pass: string) {
    return nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: email,
        pass: pass,
      },
    });
  }

  async send(
    transporter: ReturnType<typeof this.createTransport>,
    from: string,
    to: string,
    html: Buffer,
  ) {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject: 'Hello 111',
        // text: 'Kizuna AI',
        html,
      });
      console.log('邮件发送成功', info.messageId);
    } catch (err) {
      console.error(err);
    }
  }
}
