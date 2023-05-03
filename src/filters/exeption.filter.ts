import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    if (status === 400) {
      const errorResponse = {
        errors: [],
      };
      const expResponse: any = exception.getResponse();

      expResponse.message.forEach((m) => errorResponse.errors.push(m));

      response.status(status).json(errorResponse);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}

// @Catch(Error)
// export class ErrorExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();

//     if (process.env.environment !== 'production') {
//       response
//         .status(exception.getStatus())
//         .send({ error: exception.toString(), stack: exception.stack });
//     } else {
//       response.status(500).send('some error');
//     }
//   }
// }
