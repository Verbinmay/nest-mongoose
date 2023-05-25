import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CurrentUserId as CurrentPayload } from '../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../helpers/errors';
import { PaginationQuery } from '../../pagination/base-pagination';
import { BanUserForBlogDto } from '../dto/blog/ban-user-for-blog.dto';
import { BanUserForBlogByUserIdCommand } from '../use-cases/user/ban-user-for-blog-case';
import { GetBannedUsersByBlogIdCommand } from '../use-cases/user/get-banned-users-by-blog-id-case';

@Controller('blogger/users')
export class UserBloggersController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':id/ban')
  async banUserForBlogByUserId(
    @Param('id') userIdBlock: string,
    @Body() inputModel: BanUserForBlogDto,
    @CurrentPayload() payload,
  ) {
    const userId = payload ? payload.sub : '';
    const result = await this.commandBus.execute(
      new BanUserForBlogByUserIdCommand(userId, userIdBlock, inputModel),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('blog/:id')
  async getBannedUsersByBlogId(
    @Param('id') blogId: string,
    @Query() query: PaginationQuery,
    @CurrentPayload() payload,
  ) {
    const userId = payload ? payload.sub : '';
    const result = await this.commandBus.execute(
      new GetBannedUsersByBlogIdCommand(blogId, userId, query),
    );
    return makeAnswerInController(result);
  }
}
