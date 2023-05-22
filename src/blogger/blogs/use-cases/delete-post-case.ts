import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostRepository } from '../../../db/post.repository';
import { Post } from '../../../entities/post.entity';
import { BlogRepository } from '../../../db/blog.repository';

export class DeletePostCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
  ) {}

  async execute(command: DeletePostCommand) {
    const blog = await this.blogRepository.findBlogById(command.blogId);
    if (!blog) return { s: 404 };
    if (blog.userId !== command.userId) return { s: 403 };

    const post: Post | null = await this.postRepository.findPostById(
      command.postId,
    );
    if (!post) return { s: 404 };
    try {
      await this.postRepository.delete(command.postId);
      return true;
    } catch (error) {
      return { s: 500 };
    }
  }
}
