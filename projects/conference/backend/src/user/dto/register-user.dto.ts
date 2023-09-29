import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @ApiProperty()
  username: string

  @IsNotEmpty({ message: '昵称不能为空' })
  @ApiProperty()
  nickName: string

  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码不能低于6位' })
  @ApiProperty()
  password: string

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '请输入合法邮箱' })
  @ApiProperty()
  email: string

  @IsNotEmpty({ message: '验证码不能为空' })
  @ApiProperty()
  captcha: string
}
