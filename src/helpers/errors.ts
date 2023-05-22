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

export function errorMaker(strings): ErrorResult {
  const arrayErrors: Array<FieldError> = [];
  console.log(strings);
  for (let i = 0; i < strings.length; i += 2) {
    arrayErrors.push({
      message: strings[i],
      field: strings[i + 1],
    });
  }

  return { errorsMessages: arrayErrors };
}

export function makeAnswerInController(response: any) {
  if (!('s' in response) || typeof response.s !== 'number') return response;

  switch (response.s) {
    case 400:
      throw new BadRequestException(response.mf ?? null);
      break;
    case 401:
      throw new UnauthorizedException();
      break;
    case 403:
      throw new ForbiddenException();
      break;
    case 404:
      throw new NotFoundException();
      break;
    default:
      return `Error ${response.s}, sorry, try again`;
  }
}
