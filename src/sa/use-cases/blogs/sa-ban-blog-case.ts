import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogRepository } from '../../../db/blog.repository';
import { PostRepository } from '../../../db/post.repository';
import { Blog } from '../../../entities/blog.entity';
import { errorMaker } from '../../../helpers/errors';
import { SABanBlogDto } from '../../dto/blog/sa-ban-blog.dto';

export class SA_BanBlogCommand {
  constructor(public blogId: string, public inputModel: SABanBlogDto) {}
}

@CommandHandler(SA_BanBlogCommand)
export class SA_BanBlogCase implements ICommandHandler<SA_BanBlogCommand> {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async execute(command: SA_BanBlogCommand) {
    const errors = [];
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );

    if (!blog) errors.push('not normal', 'blog');
    if (errors.length !== 0) {
      return {
        s: 400,
        mf: errorMaker(errors),
      };
    }
    blog.isBanned = command.inputModel.isBanned;
    if (command.inputModel.isBanned === true) {
      blog.banDate = new Date().toISOString();
    } else blog.banDate = null;
    try {
      await this.blogRepository.save(blog);
      await this.postRepository.banPostByBlogId(
        command.blogId,
        command.inputModel.isBanned,
      );
      return true;
    } catch (error) {
      return { s: 500 };
    }
  }
}
