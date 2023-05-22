import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogRepository } from '../../../db/blog.repository';
import { Blog } from '../../../entities/blog.entity';
import { UserRepository } from '../../../db/user.repository';
import { errorMaker } from '../../../helpers/errors';

export class BindBlogWithUserCommand {
  constructor(public blogId: string, public userId: string) {}
}

@CommandHandler(BindBlogWithUserCommand)
export class BindBlogWithUserCase
  implements ICommandHandler<BindBlogWithUserCommand>
{
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: BindBlogWithUserCommand) {
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
