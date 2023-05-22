import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../../../db/user.repository';
import { BanUserDto } from '../../dto/ban-user.dto copy';
import { SessionRepository } from '../../../db/sessions.repository';

export class BunUserCommand {
  constructor(public userId: string, public inputModel: BanUserDto) {}
}

@CommandHandler(BunUserCommand)
export class BunUserCase implements ICommandHandler<BunUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly postRepository: SessionRepository,
    private readonly commentRepository: SessionRepository,
    private readonly Repository: SessionRepository,
  ) {}

  async execute(command: BunUserCommand) {
    const user = await this.userRepository.findUserById(command.userId);
    if (!user) {
      return { s: 404 };
    }
    user.banInfo.isBanned = command.inputModel.isBanned;
    user.banInfo.banReason = command.inputModel.banReason;
    user.banInfo.banDate = new Date().toISOString();
    try {
      await this.userRepository.save(user);
      await this.sessionRepository.deleteAll(command.userId);
      await 
      return true;
    } catch (error) {
      return { s: 500 };
    }
  }
}
