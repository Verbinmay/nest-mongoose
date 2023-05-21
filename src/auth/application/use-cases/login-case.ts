import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionService } from '../../../session/session.service';
import { randomUUID } from 'crypto';
import { Tokens } from '../../dto/tokens.dto';
import { JWTService } from '../../../jwt/jwt.service';

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
