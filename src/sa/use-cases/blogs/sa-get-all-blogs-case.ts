import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogRepository } from '../../../db/blog.repository';
import { Blog } from '../../../entities/blog.entity';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorBlog } from '../../../pagination/paginatorType';
import { SAViewBlogDto } from '../../dto/blog/sa-view-blog.dto';

export class SA_GetAllBlogsCommand {
  constructor(public query: PaginationQuery) {}
}

@CommandHandler(SA_GetAllBlogsCommand)
export class SA_GetAllBlogsCase
  implements ICommandHandler<SA_GetAllBlogsCommand>
{
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: SA_GetAllBlogsCommand) {
    const filterName: { name: { $regex: string } } =
      command.query.createFilterName();

    const filterSort: { [x: string]: number } = command.query.sortFilter();

    const totalCount = await this.blogRepository.findCountBlogs(filterName);

    const pagesCount = command.query.countPages(totalCount);

    const blogsFromDB: Blog[] = await this.blogRepository.findBlogs({
      find: filterName,
      sort: filterSort,
      skip: command.query.skip(),
      limit: command.query.pageSize,
    });

    const blogs: SAViewBlogDto[] = blogsFromDB.map((m) => m.SAgetViewModel());

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
