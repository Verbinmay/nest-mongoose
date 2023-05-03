import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Tokens = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return {
      refreshToken: request.cookies.refreshToken,
      accessToken: request.headers.authorization,
    };
  },
);
