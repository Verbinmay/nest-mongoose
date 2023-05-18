import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateBlogDto } from '../../dto/update-blog.dto';
import { Blog } from '../../entities/blog.entity';
import { BlogRepository } from '../../blog.repository';

export class DeleteBlogCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: DeleteBlogCommand) {
    const blog = await this.blogRepository.findBlogById(command.id);
    if (!blog) {
      return 'Error 404';
    }
    return await this.blogRepository.delete(command.id);
  }
}
