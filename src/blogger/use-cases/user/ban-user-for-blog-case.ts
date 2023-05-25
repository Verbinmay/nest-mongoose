import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogRepository } from '../../../db/blog.repository';
import { PostRepository } from '../../../db/post.repository';
import { UserRepository } from '../../../db/user.repository';
import { BanedUsers } from '../../../entities/blog.entity';
import { Post } from '../../../entities/post.entity';
import { BanUserForBlogDto } from '../../dto/blog/ban-user-for-blog.dto';

export class BanUserForBlogByUserIdCommand {
  constructor(
    public userId: string,
    public userIdBlock: string,
    public inputModel: BanUserForBlogDto,
  ) {}
}

@CommandHandler(BanUserForBlogByUserIdCommand)
export class BanUserForBlogByUserIdCase
  implements ICommandHandler<BanUserForBlogByUserIdCommand>
{
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: BanUserForBlogByUserIdCommand) {
    const blog = await this.blogRepository.findBlogById(
      command.inputModel.blogId,
    );
    if (!blog) return { s: 404 };
    if (blog.userId !== command.userId) return { s: 403 };

    const userBan = await this.userRepository.findUserById(command.userIdBlock);
    if (!userBan) return { s: 404 };

    const userBanInfo: BanedUsers = {
      userId: userBan._id.toString(),
      userLogin: userBan.login,
      banReason: command.inputModel.banReason,
      banDate: new Date().toISOString(),
    };
    blog.banedUsers.push(userBanInfo);

    try {
      this.blogRepository.save(blog);
      return true;
    } catch (error) {
      return { s: 500 };
    }
  }
}
