import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { md5 } from '../utils/md5'
import { User } from './entities/user.entity'
import { RedisService } from '../redis/redis.service'
import { RegisterUserDto } from './dto/register-user.dto'

@Injectable()
export class UserService {
  private logger = new Logger()

  @Inject(RedisService)
  private redisService: RedisService

  @InjectRepository(User)
  private userRepository: Repository<User>

  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`)

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST)
    }

    if (user.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST)
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    })

    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST)
    }

    const newUser = new User()
    newUser.username = user.username
    newUser.password = md5(user.password)
    newUser.email = user.email
    newUser.nickName = user.nickName

    try {
      await this.userRepository.save(newUser)
      return '注册成功'
    } catch (err) {
      this.logger.error(err, UserService)
      return '注册失败'
    }
  }
}
