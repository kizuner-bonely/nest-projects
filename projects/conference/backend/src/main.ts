import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { FormatResponseInterceptor } from './format-response.interceptor'
import { InvokeRecordInterceptor } from './invoke-record.interceptor'
// import { NotLoginFilter } from './not-login.filter'
import { CustomExceptionFilter } from './custom-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new FormatResponseInterceptor())
  app.useGlobalInterceptors(new InvokeRecordInterceptor())
  // app.useGlobalFilters(new NotLoginFilter())
  app.useGlobalFilters(new CustomExceptionFilter())

  const config = new DocumentBuilder()
    .setTitle('会议室预定系统')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-doc', app, document)

  app.enableCors()

  await app.listen(3000)
}
bootstrap()
