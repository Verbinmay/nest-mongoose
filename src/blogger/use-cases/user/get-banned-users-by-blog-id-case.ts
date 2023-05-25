import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogRepository } from '../../../db/blog.repository';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorBannedUsersViewModel } from '../../../pagination/paginatorType';
import { ViewBannedUserDto } from '../../dto/user/view-banned-user';

export class GetBannedUsersByBlogIdCommand {
  constructor(
    public blogId: string,
    public userId: string,
    public query: PaginationQuery,
  ) {}
}

@CommandHandler(GetBannedUsersByBlogIdCommand)
export class GetBannedUsersByBlogIdCase
  implements ICommandHandler<GetBannedUsersByBlogIdCommand>
{
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: GetBannedUsersByBlogIdCommand) {
    const blog = await this.blogRepository.findBlogById(command.blogId);
    if (!blog) return { s: 404 };
    if (blog.userId !== command.userId) return { s: 403 };
    let blogs: Array<ViewBannedUserDto> = [];
    let pagesCount = 0;
    let totalCount = 0;
    if (blog.banedUsers.length > 0) {
      let usersBanned = blog.banedUsers;

      if (command.query.searchLoginTerm !== '') {
        usersBanned = usersBanned.filter(
          (a) => a.userLogin.includes(command.query.searchLoginTerm) === true,
        );
      }

      blogs = usersBanned.map((m) => {
        return {
          id: m.userId,
          login: m.userLogin,
          banInfo: {
            isBanned: true,
            banDate: m.banDate,
            banReason: m.banReason,
          },
        };
      });
      const key = command.query.sortBy;

      if (command.query.sortDirection === 'asc') {
        blogs = blogs.sort((a, b) => (a[key] > b[key] ? 1 : -1));
      } else {
        blogs = blogs.sort((a, b) => (a[key] > b[key] ? -1 : 1));
      }

      totalCount = blogs.length;

      pagesCount = command.query.countPages(totalCount);

      blogs = blogs.slice(command.query.skip(), command.query.pageSize);
    }

    const result: PaginatorBannedUsersViewModel = {
      pagesCount: pagesCount,
      page: command.query.pageNumber,
      pageSize: command.query.pageSize,
      totalCount: totalCount,
      items: blogs,
    };

    return result;
  }
}
