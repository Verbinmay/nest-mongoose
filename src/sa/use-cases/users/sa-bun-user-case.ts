import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentRepository } from '../../../db/comment.repository';
import { PostRepository } from '../../../db/post.repository';
import { SessionRepository } from '../../../db/sessions.repository';
import { UserRepository } from '../../../db/user.repository';
import { BanUserDto } from '../../dto/user/ban-user.dto copy';

export class SA_BunUserCommand {
  constructor(public userId: string, public inputModel: BanUserDto) {}
}

@CommandHandler(SA_BunUserCommand)
export class SA_BunUserCase implements ICommandHandler<SA_BunUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(command: SA_BunUserCommand) {
    const user = await this.userRepository.findUserById(command.userId);
    if (!user) {
      return { s: 404 };
    }

    if (user.banInfo.isBanned === command.inputModel.isBanned) return true;

    user.banInfo.isBanned = command.inputModel.isBanned;
    user.banInfo.banReason =
      command.inputModel.isBanned === true
        ? command.inputModel.banReason
        : null;
    user.banInfo.banDate =
      command.inputModel.isBanned === true ? new Date().toISOString() : null;
    try {
      await this.userRepository.save(user);

      if (command.inputModel.isBanned === true) {
        await this.sessionRepository.deleteAll(command.userId);
      }
      await this.postRepository.banPostByUserId(
        command.userId,
        command.inputModel.isBanned,
      );
      await this.commentRepository.banCommentByUserId(
        command.userId,
        command.inputModel.isBanned,
      );
      return true;
    } catch (error) {
      return { s: 500 };
    }
  }
}
