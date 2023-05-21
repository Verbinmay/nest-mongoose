import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Query,
  Put,
  HttpCode,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { BasicAuthGuard } from '../guard/auth-passport/guard-passport/basic-auth.guard';
import { CreateBlogCommand } from '../blogger/blogs/use-cases/create-blog-case';
import { CreatePostByBlogIdCommand } from '../blogger/blogs/use-cases/create-post-by-blog-id-case';
import { DeleteBlogCommand } from '../blogger/blogs/use-cases/delete-blog-case';
import { GetAllBlogsCommand } from '../blog/application/use-cases/get-all-blogs-case';
import { GetBlogByBlogIdCommand } from '../blog/application/use-cases/get-blog-by-blog-id-case';
import { GetAllPostsByBlogIdCommand } from '../post/application/use-cases/get-post-by-blog-id-case';
import { UpdateBlogCommand } from '../blogger/blogs/use-cases/update-blog-case';
import { CurrentUserId } from '../decorator/currentUser.decorator';
import { makeAnswerInController } from '../helpers/errors';
import { PaginationQuery } from '../pagination/base-pagination';
import { CreateBlogDto } from '../blogger/blogs/dto/create-blog.dto';
import { CreatePostBlogDto } from '../blogger/blogs/dto/create-post-in-blog.dto';
import { UpdateBlogDto } from '../blogger/blogs/dto/update-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private commandBus: CommandBus) {}

  @Get(':id')
  async getBlogByBlogId(@Param('id') id: string) {
    const result = await this.commandBus.execute(
      new GetBlogByBlogIdCommand(id),
    );
    return makeAnswerInController(result);
  }
  @Get()
  async getAllBlogs(@Query() query: PaginationQuery) {
    const result = await this.commandBus.execute(new GetAllBlogsCommand(query));
    return makeAnswerInController(result);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() inputModel: CreateBlogDto) {
    const result = await this.commandBus.execute(
      new CreateBlogCommand(inputModel),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlog(@Param('id') id: string, @Body() inputModel: UpdateBlogDto) {
    const result = await this.commandBus.execute(
      new UpdateBlogCommand(inputModel, id),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string) {
    const result = await this.commandBus.execute(new DeleteBlogCommand(id));
    return makeAnswerInController(result);
  }

  //Create ang get post throw blog
  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() inputModel: CreatePostBlogDto,
    @CurrentUserId() user,
  ) {
    const userId = user ? user.sub : '';

    const result = await this.commandBus.execute(
      new CreatePostByBlogIdCommand(blogId, userId, inputModel),
    );
    return makeAnswerInController(result);
  }

  @Get(':blogId/posts')
  async getPostByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: PaginationQuery,
    @CurrentUserId() user,
  ) {
    const userId = user ? user.sub : '';

    const result = await this.commandBus.execute(
      new GetAllPostsByBlogIdCommand(blogId, userId, query),
    );
    return makeAnswerInController(result);
  }
}
