import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogRepository } from '../../../db/blog.repository';
import { UserRepository } from '../../../db/user.repository';
import { BanedUsers } from '../../../entities/blog.entity';
import { BanUserForBlogDto } from '../../dto/blog/ban-user-for-blog.dto';

/**Блоггер может банить пользователя для конкретного (своего) блога. Забаненный пользователь не может оставлять комментарии к постам блога, для которого он забанен */

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
    if (command.inputModel.isBanned === true) {
      const userBanInfo: BanedUsers = {
        userId: userBan._id.toString(),
        userLogin: userBan.login,
        banReason: command.inputModel.banReason,
        banDate: new Date().toISOString(),
      };
      blog.banedUsers.push(userBanInfo);
    } else {
      const index = blog.banedUsers.findIndex(
        (a) => a.userId === command.userIdBlock,
      );
      blog.banedUsers = blog.banedUsers.splice(index, 1);
    }

    try {
      this.blogRepository.save(blog);
      return true;
    } catch (error) {
      return { s: 500 };
    }
  }
}
