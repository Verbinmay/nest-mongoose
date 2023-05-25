import { PaginatorCommentWithWithPostInfoViewModel } from '../../../pagination/paginatorType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentRepository } from '../../../db/comment.repository';
import { PostRepository } from '../../../db/post.repository';
import { Comment } from '../../../entities/comment.entity';
import { Post } from '../../../entities/post.entity';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { ViewCommentWithPostInfoDto } from '../../dto/comment/view-comment-with-post-info.dto';

export class GetCommentsWithPostInfoByUserIdCommand {
  constructor(public userId: string, public query: PaginationQuery) {}
}

@CommandHandler(GetCommentsWithPostInfoByUserIdCommand)
export class GetCommentsWithPostInfoByUserIdCase
  implements ICommandHandler<GetCommentsWithPostInfoByUserIdCommand>
{
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(command: GetCommentsWithPostInfoByUserIdCommand) {
    const filterByPost = { userId: command.userId };

    const postsFromDB: Post[] = await this.postRepository.findPostsByUserId(
      filterByPost,
    );
    const postsIdArray: Array<string> = postsFromDB.map((m) =>
      m._id.toString(),
    );

    const filter = {
      postId: { $in: postsIdArray },
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

    /** Не знаю, насколько правильно было бы добавлять его функцией в entity */
    const comments: ViewCommentWithPostInfoDto[] = commentsFromDb.map((m) => {
      const post: Post = postsFromDB.find((a) => a._id.toString() === m.postId);
      return {
        id: m._id.toString(),
        content: m.content,
        commentatorInfo: {
          userId: m.commentatorInfo.userId,
          userLogin: m.commentatorInfo.userLogin,
        },
        createdAt: m.createdAt,
        postInfo: {
          id: post._id.toString(),
          title: post.title,
          blogId: post.blogId,
          blogName: post.blogName,
        },
      };
    });

    const result: PaginatorCommentWithWithPostInfoViewModel = {
      pagesCount: pagesCount,
      page: command.query.pageNumber,
      pageSize: command.query.pageSize,
      totalCount: totalCount,
      items: comments,
    };

    return result;
  }
}
