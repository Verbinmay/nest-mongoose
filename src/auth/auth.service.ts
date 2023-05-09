import { randomUUID } from 'crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import { JWTService } from '../Jwt/jwt.service';
import { SessionService } from '../session/session.service';
import { UserRepository } from '../user/user.repository';
import { Tokens } from './dto/tokens.dto';

@Injectable()
export class AuthService {
  constructor(
    private sessionService: SessionService,
    private jwtService: JWTService,
    private userRepository: UserRepository,
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

  async refreshTokens(payload) {
    const newTokens: Tokens = await this.jwtService.tokenCreator({
      sub: payload.sub,
      deviceId: payload.deviceId,
    });

    await this.sessionService.changeRefreshTokenInfo({
      newToken: newTokens.refreshToken,
      iatOldSession: payload.iat,
    });
    return newTokens;
  }

  async logout(payload) {
    const tokenRevoked = await this.sessionService.deleteSessionsByDeviceId(
      payload.deviceId,
    );

    return tokenRevoked ? true : false;
  }

  async authMe(userId) {
    const authGet: User | null = await this.userRepository.findUserById(userId);

    if (!authGet) {
      throw new UnauthorizedException();
    }

    return {
      email: authGet.email,
      login: authGet.login,
      userId: authGet._id.toString(),
    };
  }
}
