import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostRepository } from '../../post.repository';

export class GetPostByIdCommand {
  constructor(public id: string, public userId: string) {}
}

@CommandHandler(GetPostByIdCommand)
export class GetPostByIdCase implements ICommandHandler<GetPostByIdCommand> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: GetPostByIdCommand) {
    const post = await this.postRepository.findPostById(command.id);
    if (!post) {
      return 'Error 404';
    }
    return post.getViewModel(command.userId);
  }
}
