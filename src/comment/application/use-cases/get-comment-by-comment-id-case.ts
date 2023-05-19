import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentRepository } from '../../comment.repository';

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
    if (!comment) {
      return 'Error 404';
    }
    return comment.getViewModel(command.userId);
  }
}
