import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteSessionByDeviceIdCommand } from '../../../session/application/use-cases/delete-session-by-device-id-case';

export class LogoutCommand {
  constructor(public payload: any) {}
}

@CommandHandler(LogoutCommand)
export class LogoutCase implements ICommandHandler<LogoutCommand> {
  constructor(private commandBus: CommandBus) {}

  async execute(command: LogoutCommand) {
    const tokenRevoked = await this.commandBus.execute(
      new DeleteSessionByDeviceIdCommand(
        command.payload.userId,
        command.payload.deviceId,
      ),
    );
    return tokenRevoked;
  }
}
