import {
  Controller,
  Get,
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common'
import { Request } from 'express'

import { AppService } from './app.service'

const RequireLogin = () => SetMetadata('require-login', true)

const RequirePermission = (...permissions: string[]) =>
  SetMetadata('require-permissions', permissions)

const UserInfo = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()

  if (!request.user) return null
  return data ? request.user[data] : request.user
})

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('aaa')
  @RequireLogin()
  @RequirePermission('ddd')
  // @SetMetadata('require-login', true)
  // @SetMetadata('require-permissions', ['ddd'])
  aaa(@UserInfo('username') username: string, @UserInfo() userInfo) {
    console.log(username)
    console.log(userInfo)
    return 'aaa'
  }

  @Get('bbb')
  bbb() {
    return 'bbb'
  }
}
