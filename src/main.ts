import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

import { HttpExceptionFilter } from './filters/exeption.filter';
import { createApp } from './helpers/createApp';
import { AppModule } from './app.module';

async function bootstrap() {
  /*{ abortOnError: false } По умолчанию, если при создании приложения произойдет какая-либо ошибка, ваше приложение выйдет с кодом 1. Если вы хотите, чтобы он выдавал ошибку, отключите эту опцию abortOnError */
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  /*Уведены в helper  все накручивания на апп, чтобы дублировать на тесты */
  const fullApp = createApp(app);

  await fullApp.listen(3000);
}
bootstrap();
