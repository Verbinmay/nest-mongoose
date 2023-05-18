import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class ErrorResult {
  errorsMessages: Array<FieldError>;
}

export class FieldError {
  message: string;
  field: string;
}

export function errorMaker(
  msg: string,
  field: string,
  ...strings: any[]
): ErrorResult {
  const arrayErrors: Array<FieldError> = [];
  arrayErrors.push({
    message: msg,
    field: field,
  });
  if (strings.length > 0) {
    for (let i = 0; i > strings.length; i + 2) {
      arrayErrors.push({
        message: strings[i],
        field: strings[i + 1],
      });
    }
  }

  return { errorsMessages: arrayErrors };
}

export function makeAnswerInController(response: any) {
  if (typeof response !== 'string') return response;
  if (!response.includes('Error')) return response;
  const numberOfError = response.trim().substring(5).trim();

  switch (numberOfError) {
    case '400':
      throw new BadRequestException();
      break;
    case '401':
      throw new UnauthorizedException();
      break;
    case '403':
      throw new ForbiddenException();
      break;
    case '404':
      throw new NotFoundException();
      break;
    default:
      return numberOfError;
  }
}
