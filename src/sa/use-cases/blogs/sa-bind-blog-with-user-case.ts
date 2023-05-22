import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogRepository } from '../../../db/blog.repository';
import { UserRepository } from '../../../db/user.repository';
import { Blog } from '../../../entities/blog.entity';
import { errorMaker } from '../../../helpers/errors';

export class SA_BindBlogWithUserCommand {
  constructor(public blogId: string, public userId: string) {}
}

@CommandHandler(SA_BindBlogWithUserCommand)
export class SA_BindBlogWithUserCase
  implements ICommandHandler<SA_BindBlogWithUserCommand>
{
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: SA_BindBlogWithUserCommand) {
    const errors = [];
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );

    if (!blog || !('userId' in blog)) errors.push('not normal', 'blog');

    const user = await this.userRepository.findUserById(command.userId);
    if (!user) errors.push('user not exist', 'user');

    if (errors.length !== 0) {
      return {
        s: 400,
        mf: errorMaker(errors),
      };
    }
    blog.userId = command.userId;
    blog.userLogin = user.login;
    try {
      this.blogRepository.save(blog);
      return true;
    } catch (error) {
      return { s: 500 };
    }
  }
}
