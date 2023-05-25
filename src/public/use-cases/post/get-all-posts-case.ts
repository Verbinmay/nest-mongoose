import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostRepository } from '../../../db/post.repository';
import { Post } from '../../../entities/post.entity';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorPost } from '../../../pagination/paginatorType';
import { ViewPostDto } from '../../dto/post/view-post.dto';

export class GetAllPostsCommand {
  constructor(public userId: string, public query: PaginationQuery) {}
}

@CommandHandler(GetAllPostsCommand)
export class GetAllPostsCase implements ICommandHandler<GetAllPostsCommand> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: GetAllPostsCommand) {
    const filter: { isBaned: boolean } = { isBaned: false };

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
