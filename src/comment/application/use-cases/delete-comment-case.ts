import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs';

import { Comment } from '../../entities/comment.entity';
import { CommentRepository } from '../../comment.repository';

export class DeleteCommentCommand {
  constructor(public commentId: string, public userId: string) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: DeleteCommentCommand) {
    const comment: Comment | null = await this.commentRepository.findById(
      command.commentId,
    );
    if (!comment) {
      return { s: 404 };
    }

    if (comment.commentatorInfo.userId !== command.userId) {
      return { s: 403 };
    }

    const commentDelete = await this.commentRepository.deleteComment(
      command.commentId,
    );

    if (!commentDelete) {
      return { s: 500 };
    }
    return true;
  }
}
