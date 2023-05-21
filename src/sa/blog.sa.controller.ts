import {
  Controller,
  Get,
  Param,
  Query,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { BasicAuthGuard } from '../guard/auth-passport/guard-passport/basic-auth.guard';

import { makeAnswerInController } from '../helpers/errors';
import { PaginationQuery } from '../pagination/base-pagination';

import { SAGetAllBlogsCommand } from './use-cases/sa-get-all-blogs-case';
import { BindBlogWithUserCommand } from './use-cases/bind-blog-with-user-case';

@Controller('sa/blogs')
export class BlogController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async SA_GetAllBlogs(@Query() query: PaginationQuery) {
    const result = await this.commandBus.execute(
      new SAGetAllBlogsCommand(query),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id/bind-with-user/:userId')
  @HttpCode(204)
  async bindBlogWithUser(
    @Param('id') blogId: string,
    @Param('userId') userId: string,
  ) {
    const result = await this.commandBus.execute(
      new BindBlogWithUserCommand(blogId, userId),
    );
    return makeAnswerInController(result);
  }
}
