import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentRepository } from '../../../db/comment.repository';
import { PostRepository } from '../../../db/post.repository';
import { Comment } from '../../../entities/comment.entity';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorCommentWithLikeViewModel } from '../../../pagination/paginatorType';
import { ViewCommentDto } from '../../dto/comment/view-comment.dto';

export class GetAllCommentsByBlogIdCommand {
  constructor(
    public postId: string,
    public userId: string,
    public query: PaginationQuery,
  ) {}
}

@CommandHandler(GetAllCommentsByBlogIdCommand)
export class GetAllCommentsByBlogIdCase
  implements ICommandHandler<GetAllCommentsByBlogIdCommand>
{
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async execute(command: GetAllCommentsByBlogIdCommand) {
    const post = await this.postRepository.findPostById(command.postId);
    if (!post) return { s: 404 };

    const filter: { postId: string; isBaned: boolean } = {
      postId: command.postId,
      isBaned: false,
    };

    const filterSort: any = command.query.sortFilter();

    const totalCount = await this.commentRepository.findCountComments(filter);

    const pagesCount = command.query.countPages(totalCount);

    const commentsFromDb: Comment[] =
      await this.commentRepository.getCommentsByPostId({
        find: filter,
        sort: filterSort,
        skip: command.query.skip(),
        limit: command.query.pageSize,
      });

    const comments: ViewCommentDto[] = commentsFromDb.map((m) =>
      m.getViewModel(command.userId),
    );

    const result: PaginatorCommentWithLikeViewModel = {
      pagesCount: pagesCount,
      page: command.query.pageNumber,
      pageSize: command.query.pageSize,
      totalCount: totalCount,
      items: comments,
    };

    return result;
  }
}
