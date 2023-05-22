import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateCommentDto } from '../../dto/update-comment.dto';
import { Comment } from '../../../entities/comment.entity';
import { CommentRepository } from '../../../db/comment.repository';

export class UpdateCommentCommand {
  constructor(
    public commentId: string,
    public userId: string,
    public inputModel: UpdateCommentDto,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: UpdateCommentCommand) {
    const comment: Comment | null = await this.commentRepository.findById(
      command.commentId,
    );
    if (!comment) {
      return { s: 404 };
    }

    if (comment.commentatorInfo.userId !== command.userId) {
      return { s: 403 };
    }

    const commentUpdate = await this.commentRepository.updateComment(
      command.commentId,
      command.inputModel.content,
    );

    if (!commentUpdate) {
      return { s: 500 };
    }
    return true;
  }
}
