import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogRepository } from '../../../db/blog.repository';
import { PostRepository } from '../../../db/post.repository';
import { Blog } from '../../../entities/blog.entity';
import { Post } from '../../../entities/post.entity';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorPost } from '../../../pagination/paginatorType';
import { ViewPostDto } from '../../dto/post/view-post.dto';

export class GetAllPostsByBlogIdCommand {
  constructor(
    public blogId: string,
    public userId: string,
    public query: PaginationQuery,
  ) {}
}

@CommandHandler(GetAllPostsByBlogIdCommand)
export class GetAllPostsByBlogIdCase
  implements ICommandHandler<GetAllPostsByBlogIdCommand>
{
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async execute(command: GetAllPostsByBlogIdCommand) {
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    if (!blog) {
      return { s: 404 };
    }

    const filter: { blogId: string; isBaned: boolean } = {
      blogId: command.blogId,
      isBaned: false,
    };

    const filterSort: { [x: string]: number } = command.query.sortFilter();

    const totalCount = await this.postRepository.findCountPosts(filter);

    const pagesCount = command.query.countPages(totalCount);

    const postsFromDB: Post[] = await this.postRepository.findPostsWithPagination({
      find: filter,
      sort: filterSort,
      skip: command.query.skip(),
      limit: command.query.pageSize,
    });

    const posts: ViewPostDto[] = postsFromDB.map((m) =>
      m.getViewModel(command.userId),
    );

    const result: PaginatorPost = {
      pagesCount: pagesCount,
      page: command.query.pageNumber,
      pageSize: command.query.pageSize,
      totalCount: totalCount,
      items: posts,
    };

    return result;
  }
}
