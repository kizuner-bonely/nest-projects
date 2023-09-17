import { Controller, Body, Post, Get, Inject, Query } from '@nestjs/common'

import { LoginUserDto } from './dto/login-user.dto'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { EmailService } from '../email/email.service'
import { RedisService } from '../redis/redis.service'

@Controller('user')
export class UserController {
  @Inject(EmailService)
  private emailService: EmailService

  @Inject(RedisService)
  private redisService: RedisService

  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser)
  }

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8)
    await this.redisService.set(`captcha_${address}`, code, 5 * 60)
    await this.emailService.sendEmail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    })
    return '发送成功'
  }

  // @Get('init-data')
  // async initData() {
  //   await this.userService.initData()
  //   return 'done'
  // }

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    return await this.userService.userLogin(loginUser, false)
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    return await this.userService.userLogin(loginUser, true)
  }

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    return await this.userService.refresh(refreshToken, false)
  }

  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    return await this.userService.refresh(refreshToken, true)
  }
}
