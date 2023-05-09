import { Injectable } from '@nestjs/common';

import { JWTService } from '../Jwt/jwt.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from './entities/session.entity';
import { SessionRepository } from './sessions.repository';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly jwtService: JWTService,
  ) {}

  async findAll(userId: string) {
    const userSessions: Array<Session> =
      await this.sessionRepository.findSessionsByUserId(userId);

    return userSessions.map((m) => m.getViewModel());
  }

  async deleteAll(a: { userId: string; deviceId: string }) {
    return await this.sessionRepository.deleteAll(a);
  }

  async findSessionByDeviceId(deviceId: string) {
    const result: Session | null =
      await this.sessionRepository.findSessionByDeviceId(deviceId);
    return result;
  }

  async deleteSessionsByDeviceId(deviceId: string) {
    return await this.sessionRepository.deleteSessionsByDeviceId(deviceId);
  }

  async createSession(a: CreateSessionDto) {
    try {
      const newSession = Session.createSession(a);
      await this.sessionRepository.save(newSession);
      return true;
    } catch (error) {
      return false;
    }
  }

  async changeRefreshTokenInfo(a: { newToken: string; iatOldSession: number }) {
    try {
      const decoded = await this.jwtService.decoderJWTs(a.newToken);
      if (typeof decoded === 'string') {
        return false;
      }
      const session: Session | null =
        await this.sessionRepository.findSessionByDeviceIdAndUserId(
          decoded.deviceId,
          decoded.sub,
        );
      if (!session) {
        return false;
      }

      const sessionUpdated = session.updateInfo(decoded);

      await this.sessionRepository.save(sessionUpdated);
      return true;
    } catch (error) {
      return false;
    }
  }
}
