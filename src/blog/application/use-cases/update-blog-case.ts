import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateBlogDto } from '../../dto/update-blog.dto';
import { Blog } from '../../entities/blog.entity';
import { BlogRepository } from '../../blog.repository';

export class UpdateBlogCommand {
  constructor(public inputModel: UpdateBlogDto, public id: string) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: UpdateBlogCommand) {
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.id,
    );
    if (!blog) {
      return 'Error 404';
    }
    const blogUpdated = blog.updateInfo(command.inputModel);
    return this.blogRepository.save(blogUpdated);
  }
}
