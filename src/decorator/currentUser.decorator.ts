import jwtDecode from 'jwt-decode';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (
      typeof request.user === 'boolean' ||
      !request.user ||
      request.user == undefined
    ) {
      const accessToken = request.headers.authorization;
      if (!accessToken) {
        request.user = null;
        return request.user;
      } else {
        const payload = await jwtDecode(accessToken);
        request.user = payload;
        return request.user;
      }
    } else {
      return request.user;
    }
  },
);
