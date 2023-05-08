import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';

import { HttpExceptionFilter } from '../filters/exeption.filter';
import { AppModule } from '../app.module';

export const createApp = (app: INestApplication): INestApplication => {
  /*Таким образом, вызов useContainer(app.select(AppModule), { fallbackOnErrors: true }) говорит NestJS использовать контейнер TypeDI для разрешения зависимостей и воспользоваться собственным механизмом разрешения зависимостей в случае возникновения ошибки. */
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  /* app.enableCors() позволяет вашему приложению принимать запросы из других доменов, указав набор параметров, которые определяют, какие типы запросов и какие источники будут разрешены.*/
  app.enableCors();

  app.use(cookieParser());

  /* app.useGlobalPipes() - это метод из NestJS, который позволяет установить глобальные pipes (каналы) для обработки входящих данных в вашем приложении. Pipes - это объекты, которые позволяют изменять и проверять входящие данные перед тем, как они будут переданы в ваше приложение. */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory(errors) {
        const errorsForResponse = [];
        console.log(errors);
        errors.forEach((e) => {
          /* Валидация айди, написанная нами для проверки input моделей прибавляет ошибку и не считывается ограничением одной ошибки, поэтому приходится слайсить, оставляя первый объект  */
          const constraintsKeys = Object.keys(e.constraints).slice(0, 1);
          console.log(constraintsKeys);
          constraintsKeys.forEach((ckey) => {
            errorsForResponse.push({
              message: e.constraints[ckey],
              field: e.property,
            });
          });
        });

        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
  /* app.useGlobalFilters() - это метод из NestJS, который позволяет установить глобальные фильтры для обработки исключений в вашем приложении. Фильтры - это объекты, которые позволяют обрабатывать исключения и изменять ответ, который будет возвращен клиенту при возникновении ошибки.
  
  */
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    // new ErrorExceptionFilter()
  );

  return app;
};
