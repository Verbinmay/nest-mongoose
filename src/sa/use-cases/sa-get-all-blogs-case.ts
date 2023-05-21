import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaginationQuery } from '../../pagination/base-pagination';
import { BlogRepository } from '../../db/blog.repository';
import { Blog } from '../../blog/entities/blog.entity';
import { SAViewBlogDto } from '../dto/sa-view-blog.dto';
import { PaginatorBlog } from '../../pagination/paginatorType';

export class SAGetAllBlogsCommand {
  constructor(public query: PaginationQuery) {}
}

@CommandHandler(SAGetAllBlogsCommand)
export class SAGetAllBlogsCase
  implements ICommandHandler<SAGetAllBlogsCommand>
{
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: SAGetAllBlogsCommand) {
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
