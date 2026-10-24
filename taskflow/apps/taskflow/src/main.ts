import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService }  from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { TransformInterceptor } from '@app/common/transform/transform.interceptor'
import { HttpExceptionFilter } from '@app/common/http-exception/http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT') ?? 3000
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())
 app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))
  await app.listen(port);
  console.log(`app is running on port ${port}`);
}
bootstrap();
