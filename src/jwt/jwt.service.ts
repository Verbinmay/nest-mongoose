import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SessionRepository } from '../session/sessions.repository';

@Injectable()
export class JWTService {
  constructor(
    private readonly jwt: JwtService,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async createJWTAccessToken(id: string) {
    return this.jwt.sign(
      { sub: id },
      { secret: process.env.JWT_SECRET, expiresIn: '10s' },
    );
  }

  async createJWTRefreshToken(a: { deviceId: string; sub: string }) {
    return this.jwt.sign(
      { deviceId: a.deviceId, sub: a.sub },
      { secret: process.env.JWT_SECRET, expiresIn: '20s' },
    );
  }

  async tokenCreator(a: { sub: string; deviceId: string }) {
    const tokenAccess = await this.createJWTAccessToken(a.sub);
    const tokenRefresh = await this.createJWTRefreshToken({
      deviceId: a.deviceId,
      sub: a.sub,
    });

    return {
      accessToken: tokenAccess,
      refreshToken: tokenRefresh,
    };
  }

  async verifyToken(token: string) {
    try {
      const result = await this.jwt.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      if (typeof result === 'string') return null;
      if (!result.deviceId) return result;

      const session: boolean =
        await this.sessionRepository.checkRefreshTokenEqual({
          iat: result.iat,
          deviceId: result.deviceId,
          userId: result.sub,
        });
      return session ? result : null;
    } catch {
      return null;
    }
  }

  async decoderJWTs(token: string) {
    const a = this.jwt.decode(token);
    return a;
  }

  async getUserIdFromAccessToken(headersAuthorization: any) {
    let userId = '';

    if (headersAuthorization) {
      const token = headersAuthorization.split(' ')[1];

      const verify = await this.verifyToken(token);
      if (verify) {
        userId = verify.sub;
      }
    }
    return userId;
  }
}
