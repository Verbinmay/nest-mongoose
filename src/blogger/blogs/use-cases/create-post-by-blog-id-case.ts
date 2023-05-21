import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Post } from '../../../post/entities/post.entity';
import { PostRepository } from '../../../post/post.repository';
import { CreatePostBlogDto } from '../dto/create-post-in-blog.dto';
import { Blog } from '../../../blog/entities/blog.entity';
import { BlogRepository } from '../../../db/blog.repository';

export class CreatePostByBlogIdCommand {
  constructor(
    public blogId: string,
    public userId: string,
    public inputModel: CreatePostBlogDto,
  ) {}
}

@CommandHandler(CreatePostByBlogIdCommand)
export class CreatePostByBlogIdCase
  implements ICommandHandler<CreatePostByBlogIdCommand>
{
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async execute(command: CreatePostByBlogIdCommand) {
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    if (!blog) return 'Error 404';
    if (blog.userId !== command.userId) return 'Error 403';

    const post: Post = new Post(
      command.blogId,
      blog.name,
      command.userId,
      command.inputModel,
    );
    try {
      const result = await this.postRepository.save(post);
      return result.getViewModel(command.userId);
    } catch (error) {
      return 'Error 500';
    }
  }
}
