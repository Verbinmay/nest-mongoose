import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';

import { JWTService } from '../Jwt/jwt.service';
import { SessionService } from '../session/session.service';
import { Tokens } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private sessionService: SessionService,
    private jwtService: JWTService,
  ) {}

  // async validateUser(loginOrEmail: string, pass: string) {
  //   const user = await this.usersRepository.findUserByLoginOrEmail(
  //     loginOrEmail,
  //   );
  //   if (!user) return null;

  //   const match: boolean = await bcrypt.compare(pass, user.hash);

  //   return match ? user._id.toString() : null;
  // }

  async login(a: {
    userId: string;
    loginOrEmail: string;
    password: string;
    ip: string;
    title: string;
  }) {
    const deviceId: string = randomUUID();

    const tokens: Tokens = await this.jwtService.tokenCreator({
      sub: a.userId,
      deviceId: deviceId,
    });
    const decoder = await this.jwtService.decoderJWTs(tokens.refreshToken);

    if (typeof decoder == 'string') {
      return null;
    }
    const sessionCreate: boolean = await this.sessionService.createSession({
      iat: decoder.iat,
      expirationDate: decoder.exp,
      ip: a.ip,
      title: a.title,
      deviceId: deviceId,
      userId: a.userId,
    });

    return sessionCreate ? tokens : null;
  }
}
