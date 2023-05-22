import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SessionRepository } from '../../../db/sessions.repository';

export class DeleteAllSessionsWithoutCurrentCommand {
  constructor(public userId: string, public deviceId: string) {}
}

@CommandHandler(DeleteAllSessionsWithoutCurrentCommand)
export class DeleteAllSessionsWithoutCurrentCase
  implements ICommandHandler<DeleteAllSessionsWithoutCurrentCommand>
{
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(command: DeleteAllSessionsWithoutCurrentCommand) {
    const sessionsDelete = await this.sessionRepository.deleteAllWithoutCurrent(
      command.userId,
      command.deviceId,
    );
    if (sessionsDelete) {
      return true;
    } else {
      return { s: 404 };
    }
  }
}
