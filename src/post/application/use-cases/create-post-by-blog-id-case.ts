import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Post } from '../../entities/post.entity';
import { PostRepository } from '../../post.repository';
import { CreatePostBlogDto } from '../../../blog/dto/create-post-in-blog.dto';
import { Blog } from '../../../blog/entities/blog.entity';
import { BlogRepository } from '../../../blog/blog.repository';

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
    if (!blog) {
      return 'Error 404';
    }
    const post: Post = Post.createPost(
      blog.name,
      command.inputModel,
      command.blogId,
    );
    const result = await this.postRepository.save(post);

    return result.getViewModel(command.userId);
  }
}
