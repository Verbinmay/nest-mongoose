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

import { BasicAuthGuard } from '../../guard/auth-passport/guard-passport/basic-auth.guard';
import { makeAnswerInController } from '../../helpers/errors';
import { PaginationQuery } from '../../pagination/base-pagination';
import { SA_BindBlogWithUserCommand } from '../use-cases/blogs/sa-bind-blog-with-user-case';
import { SA_GetAllBlogsCommand } from '../use-cases/blogs/sa-get-all-blogs-case';

@Controller('sa/blogs')
export class BlogSAController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async SA_GetAllBlogs(@Query() query: PaginationQuery) {
    const result = await this.commandBus.execute(
      new SA_GetAllBlogsCommand(query),
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
      new SA_BindBlogWithUserCommand(blogId, userId),
    );
    return makeAnswerInController(result);
  }
}
