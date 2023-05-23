import { randomUUID } from 'crypto';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../../../db/user.repository';
import { JWTService } from '../../../jwt/jwt.service';
import { Tokens } from '../../dto/auth/tokens.dto';
import { SessionService } from '../../services/session.service';

export class LoginCommand {
  constructor(
    public userId: string,
    public loginOrEmail: string,
    public password: string,
    public ip: string,
    public title: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginCase implements ICommandHandler<LoginCommand> {
  constructor(
    private sessionService: SessionService,
    private jwtService: JWTService,
    private userRepository: UserRepository,
  ) {}

  async execute(command: LoginCommand) {
    const deviceId: string = randomUUID();

    const tokens: Tokens = await this.jwtService.tokenCreator({
      sub: command.userId,
      deviceId: deviceId,
    });
    const decoder = await this.jwtService.decoderJWTs(tokens.refreshToken);

    if (typeof decoder == 'string') {
      return { s: 500 };
    }
    const sessionCreate: boolean = await this.sessionService.createSession({
      iat: decoder.iat,
      expirationDate: decoder.exp,
      ip: command.ip,
      title: command.title,
      deviceId: deviceId,
      userId: command.userId,
    });

    return sessionCreate ? tokens : { s: 500 };
  }
}
