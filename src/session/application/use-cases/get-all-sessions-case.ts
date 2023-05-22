import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SessionRepository } from '../../../db/sessions.repository';
import { Session } from '../../../entities/session.entity';

export class GetAllSessionsCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetAllSessionsCommand)
export class GetAllSessionsCase
  implements ICommandHandler<GetAllSessionsCommand>
{
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(command: GetAllSessionsCommand) {
    const userSessions: Array<Session> =
      await this.sessionRepository.findSessionsByUserId(command.userId);

    return userSessions.map((m) => m.getViewModel());
  }
}
