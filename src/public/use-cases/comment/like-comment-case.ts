import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentRepository } from '../../../db/comment.repository';
import { UserRepository } from '../../../db/user.repository';
import { LikeDto } from '../../dto/likes/like.dto';

export class LikeCommentCommand {
  constructor(
    public commentId: string,
    public userId: string,
    public inputModel: LikeDto,
  ) {}
}

@CommandHandler(LikeCommentCommand)
export class LikeCommentCase implements ICommandHandler<LikeCommentCommand> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: LikeCommentCommand) {
    const comment = await this.commentRepository.findById(command.commentId);

    if (!comment || comment.isBaned === true) {
      return { s: 404 };
    }

    let myStatusBefore = '';
    const like = comment.likesInfo.find((m) => m.userId === command.userId);
    if (like) {
      myStatusBefore = like.status;
    }

    if (myStatusBefore === command.inputModel.likeStatus) {
      return true;
    }

    const user = await this.userRepository.findUserById(command.userId);

    if (!user) {
      return { s: 404 };
    }

    const index = comment.likesInfo.findIndex(
      (m) => m.userId === command.userId,
    );

    if (
      command.inputModel.likeStatus === 'None' &&
      comment.likesInfo.length > 0
    ) {
      if (index > -1) {
        comment.likesInfo.splice(index, 1);
      }
    } else if (
      command.inputModel.likeStatus === 'Like' ||
      command.inputModel.likeStatus === 'Dislike'
    ) {
      if (index > -1) {
        comment.likesInfo[index].status = command.inputModel.likeStatus;
        comment.likesInfo[index].addedAt = new Date().toISOString();
      } else {
        comment.likesInfo.push({
          addedAt: new Date().toISOString(),
          userId: command.userId,
          login: user.login,
          status: command.inputModel.likeStatus,
          isBaned: false,
        });
      }
    }

    try {
      await this.commentRepository.save(comment);
      return true;
    } catch (error) {
      return { s: 500 };
    }
  }
}
