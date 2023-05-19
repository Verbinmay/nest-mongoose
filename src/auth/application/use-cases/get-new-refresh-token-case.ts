import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionService } from '../../../session/session.service';
import { Tokens } from '../../dto/tokens.dto';
import { JWTService } from '../../../jwt/jwt.service';

export class GetNewTokensCommand {
  constructor(public payload: any) {}
}

@CommandHandler(GetNewTokensCommand)
export class GetNewTokensCase implements ICommandHandler<GetNewTokensCommand> {
  constructor(
    private sessionService: SessionService,
    private jwtService: JWTService,
  ) {}

  async execute(command: GetNewTokensCommand) {
    const newTokens: Tokens = await this.jwtService.tokenCreator({
      sub: command.payload.sub,
      deviceId: command.payload.deviceId,
    });

    await this.sessionService.changeRefreshTokenInfo({
      newToken: newTokens.refreshToken,
      iatOldSession: command.payload.iat,
    });
    return newTokens;
  }
}
