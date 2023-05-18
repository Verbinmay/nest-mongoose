import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateBlogDto } from '../../dto/create-blog.dto';
import { Blog } from '../../entities/blog.entity';
import { BlogRepository } from '../../blog.repository';

export class CreateBlogCommand {
  constructor(public inputModel: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: CreateBlogCommand) {
    const blog: Blog = new Blog(command.inputModel);
    const result = await this.blogRepository.save(blog);
    return result.getViewModel();
  }
}
