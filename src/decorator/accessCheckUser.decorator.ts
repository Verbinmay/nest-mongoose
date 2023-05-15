// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';

// export const accessCheckUser = createParamDecorator(
//   (data: unknown, context: ExecutionContext) => {
//     const request = context.switchToHttp().getRequest();
//     const accessToken = request.headers.authorization;
//     if (!accessToken) {
//       request.user = '';
//       return true;
//     } else {
//       const jwt = new JwtService();
//       const verify = jwt.decode(accessToken);
//       request.user = verify;
//       return true;
//     }
//   },
// );
