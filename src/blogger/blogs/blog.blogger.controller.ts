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

import { CreateBlogCommand } from './use-cases/create-blog-case';
import { CreatePostByBlogIdCommand } from './use-cases/create-post-by-blog-id-case';
import { DeleteBlogCommand } from './use-cases/delete-blog-case';
import { UpdateBlogCommand } from './use-cases/update-blog-case';
import { CurrentUserId as CurrentPayload } from '../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../helpers/errors';
import { PaginationQuery } from '../../pagination/base-pagination';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CreatePostBlogDto } from './dto/create-post-in-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { GetCurrentUserBlogsCommand } from './use-cases/get-current-user-blogs-case';
import { UpdatePostByBlogDto } from './dto/update-post-by-blog.dto';
import { UpdatePostCommand } from './use-cases/update-post-case';
import { DeletePostCommand } from './use-cases/delete-post-case';

@Controller('blogger/blogs')
export class BlogController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCurrentUserBlogs(
    @Query() query: PaginationQuery,
    @CurrentPayload() payload,
  ) {
    const userId = payload ? payload.sub : '';
    const result = await this.commandBus.execute(
      new GetCurrentUserBlogsCommand(userId, query),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBlog(
    @Body() inputModel: CreateBlogDto,
    @CurrentPayload() payload,
  ) {
    const userId = payload ? payload.sub : '';
    const result = await this.commandBus.execute(
      new CreateBlogCommand(userId, inputModel),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') blogId: string,
    @Body() inputModel: UpdateBlogDto,
    @CurrentPayload() payload,
  ) {
    const userId = payload ? payload.sub : '';
    const result = await this.commandBus.execute(
      new UpdateBlogCommand(blogId, userId, inputModel),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') blogId: string, @CurrentPayload() payload) {
    const userId = payload ? payload.sub : '';
    const result = await this.commandBus.execute(
      new DeleteBlogCommand(blogId, userId),
    );
    return makeAnswerInController(result);
  }

  //Create ang get post throw blog
  @UseGuards(JwtAuthGuard)
  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() inputModel: CreatePostBlogDto,
    @CurrentPayload() user,
  ) {
    const userId = user ? user.sub : '';
    const result = await this.commandBus.execute(
      new CreatePostByBlogIdCommand(blogId, userId, inputModel),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':blogId/posts/:postId')
  async updatePostByBlogId(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() inputModel: UpdatePostByBlogDto,
    @CurrentPayload() user,
  ) {
    const userId: string = user ? user.sub : '';

    const result: boolean | string = await this.commandBus.execute(
      new UpdatePostCommand(blogId, postId, userId, inputModel),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':blogId/posts/:postId')
  async deletePostByBlogId(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @CurrentPayload() user,
  ) {
    const userId: string = user ? user.sub : '';

    const result: boolean | string = await this.commandBus.execute(
      new DeletePostCommand(blogId, postId, userId),
    );
    return makeAnswerInController(result);
  }
}
