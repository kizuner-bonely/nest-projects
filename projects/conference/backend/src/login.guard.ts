import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import { Request } from 'express'

import { JwtUserData } from './global'
import { UnLoginException } from './not-login.filter'

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector

  @Inject(JwtService)
  private jwtService: JwtService

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler(),
    ])

    if (!requireLogin) return true

    const authorization = request.headers.authorization

    if (!authorization) {
      throw new UnLoginException()
    }

    try {
      const token = authorization.split(' ')[1]
      const data = this.jwtService.verify<JwtUserData>(token)

      request.user = {
        userId: data.userId,
        username: data.username,
        roles: data.roles,
        permissions: data.permissions,
      }

      return true
    } catch (err) {
      throw new UnauthorizedException('token 已失效, 请重新登录')
    }
  }
}
