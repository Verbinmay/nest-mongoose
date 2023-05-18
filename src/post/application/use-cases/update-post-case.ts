import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogRepository } from '../../../blog/blog.repository';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { Post } from '../../entities/post.entity';
import { PostRepository } from '../../post.repository';

export class UpdatePostCommand {
  constructor(public id: string, public inputModel: UpdatePostDto) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
  ) {}

  async execute(command: UpdatePostCommand) {
    const post: Post | null = await this.postRepository.findPostById(
      command.id,
    );
    if (!post) {
      return 'Error 404';
    }
    const blog = await this.blogRepository.findBlogById(
      command.inputModel.blogId,
    );
    if (!blog) {
      return 'Error 404';
    }

    const postUpdated = post.updateInfo(command.inputModel, blog.name);
    return this.postRepository.save(postUpdated);
  }
}
