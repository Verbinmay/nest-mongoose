import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CurrentUserId as CurrentPayload } from '../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../helpers/errors';
import { PaginationQuery } from '../../pagination/base-pagination';
import { GetCommentsWithPostInfoByUserIdCommand } from '../use-cases/comment/get-comments-with-post-info-for-current-user';

@Controller('blogger/blogs')
export class CommentBloggersController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Get('comments')
  async getAllCommentsWithPostInfoByUserId(
    @Query() query: PaginationQuery,
    @CurrentPayload() payload,
  ) {
    const userId = payload ? payload.sub : '';
    const result = await this.commandBus.execute(
      new GetCommentsWithPostInfoByUserIdCommand(userId, query),
    );
    return makeAnswerInController(result);
  }
}
