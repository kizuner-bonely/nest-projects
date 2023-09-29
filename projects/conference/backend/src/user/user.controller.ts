import {
  Controller,
  Body,
  Post,
  Get,
  Inject,
  Query,
  ParseIntPipe,
  BadRequestException,
  DefaultValuePipe,
} from '@nestjs/common'

import { UpdateUserPasswordDto } from './dto/update-user-password.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { EmailService } from '../email/email.service'
import { RedisService } from '../redis/redis.service'
import { RequireLogin } from '../decorators'
import { UserInfo } from '../common'
import { UserDetailInfo } from './vo/user-info.vo'
import { UpdateUserDto } from './dto/update-user.dto'
import { generateParseIntPipe } from '../utils'

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

  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    const user = await this.userService.findUserDetailById(userId)

    const vo = new UserDetailInfo()
    vo.id = user.id
    vo.email = user.email
    vo.username = user.username
    vo.avatar = user.avatar
    vo.phoneNumber = user.phoneNumber
    vo.nickName = user.nickName
    vo.createTime = user.createTime
    vo.isFrozen = user.isFrozen

    return vo
  }

  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(userId, passwordDto)
  }

  @Get('update_password/captcha')
  async updatePasswordCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8)

    await this.redisService.set(
      `update_password_captcha_${address}`,
      code,
      60 * 10,
    )

    await this.emailService.sendEmail({
      to: address,
      subject: '梗概密码验证码',
      html: `<p>你用于更改密码的验证码为${code}</p>`,
    })
    return '发送成功'
  }

  @Post(['update', 'admin/update'])
  @RequireLogin()
  async update(
    @UserInfo('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, updateUserDto)
  }

  @Get('update/captcha')
  async updateCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8)

    await this.redisService.set(`update_user_captcha_${address}`, code, 60 * 10)

    await this.emailService.sendEmail({
      to: address,
      subject: '更改用户信息验证码',
      html: `<p>你的验证码是 ${code}</p>`,
    })
    return '发送成功'
  }

  @Get('freeze')
  async freeze(@Query('id') userId: number) {
    await this.userService.freezeUserById(userId)
    return 'success'
  }

  @Get('list')
  async list(
    @Query(
      'pageIndex',
      new DefaultValuePipe(1),
      generateParseIntPipe('pageIndex'),
    )
    pageIndex: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(2),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
  ) {
    return await this.userService.findUsersByPage(
      username,
      nickName,
      email,
      pageIndex,
      pageSize,
    )
  }
}
