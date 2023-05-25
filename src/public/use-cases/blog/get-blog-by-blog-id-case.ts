import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogRepository } from '../../../db/blog.repository';

export class GetBlogByBlogIdCommand {
  constructor(public id: string) {}
}

@CommandHandler(GetBlogByBlogIdCommand)
export class GetBlogByBlogIdCase
  implements ICommandHandler<GetBlogByBlogIdCommand>
{
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: GetBlogByBlogIdCommand) {
    const blog = await this.blogRepository.findBlogById(command.id);
    if (!blog || blog.isBanned === true) {
      return { s: 404 };
    }
    return blog.getViewModel();
  }
}
