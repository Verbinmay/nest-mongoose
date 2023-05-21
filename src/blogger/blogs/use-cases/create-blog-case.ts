import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateBlogDto } from '../dto/create-blog.dto';
import { Blog } from '../../../blog/entities/blog.entity';
import { BlogRepository } from '../../../db/blog.repository';

export class CreateBlogCommand {
  constructor(public userId: string, public inputModel: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: CreateBlogCommand) {
    const blog: Blog = new Blog(command.userId, command.inputModel);
    const result = await this.blogRepository.save(blog);
    return result.getViewModel();
  }
}
