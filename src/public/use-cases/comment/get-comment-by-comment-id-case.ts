import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentRepository } from '../../../db/comment.repository';

export class GetCommentByCommentIdCommand {
  constructor(public id: string, public userId: string) {}
}

@CommandHandler(GetCommentByCommentIdCommand)
export class GetCommentByCommentIdCase
  implements ICommandHandler<GetCommentByCommentIdCommand>
{
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: GetCommentByCommentIdCommand) {
    const comment = await this.commentRepository.findById(command.id);
    if (!comment || comment.isBaned === true) {
      return { s: 404 };
    }
    return comment.getViewModel(command.userId);
  }
}
