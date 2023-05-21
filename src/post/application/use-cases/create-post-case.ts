import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog } from '../../../blog/entities/blog.entity';
import { BlogRepository } from '../../../db/blog.repository';
import { CreatePostDto } from '../../dto/create-post.dto';
import { Post } from '../../entities/post.entity';
import { PostRepository } from '../../post.repository';

export class CreatePostCommand {
  constructor(public userId: string, public inputModel: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async execute(command: CreatePostCommand) {
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.inputModel.blogId,
    );
    if (!blog) {
      return 'Error 404';
    }
    const post: Post = Post.createPost(blog.name, command.inputModel);
    const result = await this.postRepository.save(post);

    return result.getViewModel(command.userId);
  }
}
