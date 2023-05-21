import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateBlogDto } from '../dto/update-blog.dto';
import { Blog } from '../../../blog/entities/blog.entity';
import { BlogRepository } from '../../../db/blog.repository';

export class UpdateBlogCommand {
  constructor(
    public blogId: string,
    public userId: string,
    public inputModel: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: UpdateBlogCommand) {
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    if (!blog) return { s: 404 };
    if (blog.userId !== command.userId) return { s: 403 };

    const blogUpdated = blog.updateInfo(command.inputModel);
    try {
      this.blogRepository.save(blogUpdated);
      return true;
    } catch (error) {
      return { s: 500 };
    }
  }
}
