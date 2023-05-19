import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SessionRepository } from '../../sessions.repository';
import { Session } from '../../entities/session.entity';

export class DeleteSessionByDeviceIdCommand {
  constructor(public userId: string, public deviceId: string) {}
}

@CommandHandler(DeleteSessionByDeviceIdCommand)
export class DeleteSessionByDeviceIdCase
  implements ICommandHandler<DeleteSessionByDeviceIdCommand>
{
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(command: DeleteSessionByDeviceIdCommand) {
    const session: Session | null =
      await this.sessionRepository.findSessionByDeviceId(command.deviceId);
    if (!session) {
      return 'Error 404';
    }
    if (session.userId !== command.userId) {
      return 'Error 403';
    }

    const sessionDelete: boolean =
      await this.sessionRepository.deleteSessionsByDeviceId(command.deviceId);

    if (sessionDelete == false) {
      return 'Error 404';
    }
    return sessionDelete;
  }
}