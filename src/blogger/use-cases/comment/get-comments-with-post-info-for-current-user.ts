import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentRepository } from '../../../db/comment.repository';
import { PostRepository } from '../../../db/post.repository';
import { Comment } from '../../../entities/comment.entity';
import { Post } from '../../../entities/post.entity';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorCommentWithWithPostInfoViewModel } from '../../../pagination/paginatorType';
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
    const comments: ViewCommentWithPostInfoDto[] = commentsFromDb.map(
      (comment) => {
        const post: Post = postsFromDB.find(
          (post) => post._id.toString() === comment.postId,
        );
        let status: 'None' | 'Like' | 'Dislike' = 'None';
        let likesCount = 0;
        let dislikeCount = 0;
        if (comment.likesInfo.length !== 0) {
          const like = comment.likesInfo.find(
            (like) => like.userId === command.userId,
          );
          if (like) status = like.status;

          likesCount = comment.likesInfo.filter(
            (like) => like.status === 'Like' && like.isBaned === false,
          ).length;

          dislikeCount = comment.likesInfo.filter(
            (like) => like.status === 'Dislike' && like.isBaned === false,
          ).length;
        }
        return {
          id: comment._id.toString(),
          content: comment.content,
          commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
          },
          createdAt: comment.createdAt,
          postInfo: {
            id: post._id.toString(),
            title: post.title,
            blogId: post.blogId,
            blogName: post.blogName,
          },
          likesInfo: {
            likesCount: likesCount,
            dislikesCount: dislikeCount,
            myStatus: status,
          },
        };
      },
    );

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
