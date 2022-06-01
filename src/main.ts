/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { createDocument } from './config/swagger/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AuthenticationMiddleware } from './config/middleware/authentication.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerModule.setup('api', app,createDocument(app));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(cookieParser());
  // app.use(new AuthenticationMiddleware());
  await app.listen(3001);
}
bootstrap();
