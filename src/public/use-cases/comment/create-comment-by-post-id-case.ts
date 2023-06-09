import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogRepository } from '../../../db/blog.repository';
import { CommentRepository } from '../../../db/comment.repository';
import { PostRepository } from '../../../db/post.repository';
import { UserRepository } from '../../../db/user.repository';
import { Blog } from '../../../entities/blog.entity';
import { Comment } from '../../../entities/comment.entity';
import { Post } from '../../../entities/post.entity';
import { User } from '../../../entities/user.entity';
import { CreateCommentDto } from '../../dto/comment/create-comment.dto';

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
    private readonly blogRepository: BlogRepository,
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
    /**Проверка на забаненность  */
    const blog: Blog | null = await this.blogRepository.findBlogById(
      post.blogId,
    );
    if (!blog) {
      return { s: 404 };
    }
    if (blog.banedUsers.some((m) => m.userId === command.userId)) {
      return { s: 403 };
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
