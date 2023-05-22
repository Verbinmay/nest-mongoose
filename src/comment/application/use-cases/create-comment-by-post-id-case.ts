import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateCommentDto } from '../../dto/create-comment.dto';
import { Comment } from '../../../entities/comment.entity';
import { User } from '../../../entities/user.entity';
import { CommentRepository } from '../../../db/comment.repository';
import { UserRepository } from '../../../db/user.repository';
import { Post } from '../../../entities/post.entity';
import { PostRepository } from '../../../db/post.repository';

export class PostCommentByBlogIdCommand {
  constructor(
    public postId: string,
    public userId: string,
    public inputModel: CreateCommentDto,
  ) {}
}

@CommandHandler(PostCommentByBlogIdCommand)
export class CreateCommentByBlogIdCase
  implements ICommandHandler<PostCommentByBlogIdCommand>
{
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: PostCommentByBlogIdCommand) {
    const post: Post | null = await this.postRepository.findPostById(
      command.postId,
    );

    if (!post) {
      return { s: 404 };
    }
    const user: User | null = await this.userRepository.findUserById(
      command.userId,
    );
    if (!user) {
      return { s: 404 };
    }
    const comment = Comment.createComment({
      content: command.inputModel.content,
      userId: user._id.toString(),
      userLogin: user.login,
      postId: command.postId,
    });
    try {
      const result = await this.commentRepository.save(comment);
      return result.getViewModel(user._id.toString());
    } catch (error) {
      return { s: 500 };
    }
  }
}
