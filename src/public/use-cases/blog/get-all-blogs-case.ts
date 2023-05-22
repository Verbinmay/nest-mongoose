import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ViewBlogDto } from '../../../blogger/dto/blog/view-blog.dto';
import { BlogRepository } from '../../../db/blog.repository';
import { Blog } from '../../../entities/blog.entity';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorBlog } from '../../../pagination/paginatorType';

export class GetAllBlogsCommand {
  constructor(public query: PaginationQuery) {}
}

@CommandHandler(GetAllBlogsCommand)
export class GetAllBlogsCase implements ICommandHandler<GetAllBlogsCommand> {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: GetAllBlogsCommand) {
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
