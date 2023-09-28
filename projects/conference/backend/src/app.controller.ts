import { Controller, Get, SetMetadata } from '@nestjs/common'

import { AppService } from './app.service'
import { RequireLogin, RequirePermission } from './decorators'
import { UserInfo } from './common'

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
