import jwtDecode from 'jwt-decode';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const CurrentUserId = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (
      typeof request.user === 'boolean' ||
      !request.user ||
      request.user == undefined
    ) {
      let accessToken = request.headers.authorization;
      if (!accessToken) {
        request.user = null;
        return request.user;
      } else {
        if (accessToken.includes('Bearer')) {
          accessToken = accessToken.slice(7);
        }
        // const payload = await jwtDecode(accessToken);
        // request.user = payload;
        // return request.user;

        const jwtService = new JwtService({});

        try {
          const decoded = jwtService.decode(accessToken);

          request.user = decoded;
          return request.user;
        } catch (error) {
          request.user = null;
          return request.user;
        }
      }
    } else {
      return request.user;
    }
  },
);
