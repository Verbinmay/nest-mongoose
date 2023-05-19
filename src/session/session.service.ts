import { Injectable } from '@nestjs/common';

import { JWTService } from '../jwt/jwt.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from './entities/session.entity';
import { SessionRepository } from './sessions.repository';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly jwtService: JWTService,
  ) {}

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
