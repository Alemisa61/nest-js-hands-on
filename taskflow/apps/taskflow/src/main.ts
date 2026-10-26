import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService }  from '@nestjs/config'
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common'
import { TransformInterceptor } from '@app/common/transform/transform.interceptor'
import { HttpExceptionFilter } from '@app/common/http-exception/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT') ?? 3000
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Taskflow API')
    .setDescription('The Taskflow API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);
  app.useGlobalFilters(new HttpExceptionFilter())
 app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))
  await app.listen(port);
  console.log(`app is running on port ${port}`);
}
bootstrap();

