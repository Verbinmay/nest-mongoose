import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../../session/sessions.repository';

export class LogoutCommand {
  constructor(public payload: any) {}
}

@CommandHandler(LogoutCommand)
export class LogoutCase implements ICommandHandler<LogoutCommand> {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(command: LogoutCommand) {
    const tokenRevoked = await this.sessionRepository.deleteSessionLogout(
      command.payload.userId,
      command.payload.deviceId,
    );

    return tokenRevoked === true ? tokenRevoked : 'Error 404';
  }
}
