import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogRepository } from '../../../db/blog.repository';
import { Post } from '../../../post/entities/post.entity';
import { PostRepository } from '../../../post/post.repository';
import { UpdatePostByBlogDto } from '../dto/update-post-by-blog.dto';

export class UpdatePostCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public userId: string,
    public inputModel: UpdatePostByBlogDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
  ) {}

  async execute(command: UpdatePostCommand) {
    const blog = await this.blogRepository.findBlogById(command.blogId);
    if (!blog) return 'Error 404';
    if (blog.userId !== command.userId) return 'Error 403';

    const post: Post | null = await this.postRepository.findPostById(
      command.postId,
    );
    if (!post) return 'Error 404';

    const postUpdated = post.updateInfo(command.inputModel);
    return this.postRepository.save(postUpdated);
  }
}