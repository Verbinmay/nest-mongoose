import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateBlogDto } from '../dto/create-blog.dto';
import { Blog } from '../../../entities/blog.entity';
import { BlogRepository } from '../../../db/blog.repository';
import { UserRepository } from '../../../db/user.repository';

export class CreateBlogCommand {
  constructor(public userId: string, public inputModel: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateBlogCommand) {
    const user = await this.userRepository.findUserById(command.userId);
    if (!user) return 'Error 500';
    const blog: Blog = new Blog(command.userId, user.login, command.inputModel);
    const result = await this.blogRepository.save(blog);
    return result.getViewModel();
  }
}
