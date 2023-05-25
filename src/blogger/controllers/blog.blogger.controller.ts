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

import { JwtAuthGuard } from '../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CurrentUserId as CurrentPayload } from '../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../helpers/errors';
import { PaginationQuery } from '../../pagination/base-pagination';
import { CreateBlogDto } from '../dto/blog/create-blog.dto';
import { UpdateBlogDto } from '../dto/blog/update-blog.dto';
import { CreateBlogCommand } from '../use-cases/blog/create-blog-case';
import { DeleteBlogCommand } from '../use-cases/blog/delete-blog-case';
import { GetCurrentUserBlogsCommand } from '../use-cases/blog/get-current-user-blogs-case';
import { UpdateBlogCommand } from '../use-cases/blog/update-blog-case';

@Controller('blogger/blogs')
export class BlogBloggersController {
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
}
