import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostRepository } from '../../post.repository';

export class DeletePostCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostCase implements ICommandHandler<DeletePostCommand> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: DeletePostCommand) {
    const post = await this.postRepository.findPostById(command.id);
    if (!post) {
      return 'Error 404';
    }
    return await this.postRepository.delete(command.id);
  }
}
