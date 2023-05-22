import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogRepository } from '../../../db/blog.repository';
import { Blog } from '../../../entities/blog.entity';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorBlog } from '../../../pagination/paginatorType';
import { ViewBlogDto } from '../../dto/blog/view-blog.dto';

export class GetCurrentUserBlogsCommand {
  constructor(public userId: string, public query: PaginationQuery) {}
}

@CommandHandler(GetCurrentUserBlogsCommand)
export class GetCurrentUserBlogsCase
  implements ICommandHandler<GetCurrentUserBlogsCommand>
{
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: GetCurrentUserBlogsCommand) {
    const filterName: { name: { $regex: string } } =
      command.query.createFilterNameAndId(command.userId);

    const filterSort: { [x: string]: number } = command.query.sortFilter();

    const totalCount = await this.blogRepository.findCountBlogs(filterName);

    const pagesCount = command.query.countPages(totalCount);

    const blogsFromDB: Blog[] = await this.blogRepository.findBlogs({
      find: filterName,
      sort: filterSort,
      skip: command.query.skip(),
      limit: command.query.pageSize,
    });

    const blogs: ViewBlogDto[] = blogsFromDB.map((m) => m.getViewModel());

    const result: PaginatorBlog = {
      pagesCount: pagesCount,
      page: command.query.pageNumber,
      pageSize: command.query.pageSize,
      totalCount: totalCount,
      items: blogs,
    };

    return result;
  }
}
