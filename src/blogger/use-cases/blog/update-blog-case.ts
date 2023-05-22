import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogRepository } from '../../../db/blog.repository';
import { Blog } from '../../../entities/blog.entity';
import { UpdateBlogDto } from '../../dto/blog/update-blog.dto';

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
