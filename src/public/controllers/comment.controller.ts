import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { LikeDto } from '../dto/likes/like.dto';
import { DeleteCommentCommand } from '../use-cases/comment/delete-comment-case';
import { GetCommentByCommentIdCommand } from '../use-cases/comment/get-comment-by-comment-id-case';
import { LikeCommentCommand } from '../use-cases/comment/like-comment-case';
import { UpdateCommentCommand } from '../use-cases/comment/update-comment-case';
import { CurrentUserId } from '../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../helpers/errors';
import { UpdateCommentDto } from '../dto/comment/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get(':id')
  async getCommentByCommentId(@Param('id') id: string, @CurrentUserId() user) {
    const userId = user ? user.sub : '';

    const result = await this.commandBus.execute(
      new GetCommentByCommentIdCommand(id, userId),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() inputModel: UpdateCommentDto,
    @CurrentUserId() user,
  ) {
    const userId: string = user ? user.sub : '';

    const result: boolean | string = await this.commandBus.execute(
      new UpdateCommentCommand(commentId, userId, inputModel),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @CurrentUserId() user,
  ) {
    const userId = user ? user.sub : '';
    const result: boolean | string = await this.commandBus.execute(
      new DeleteCommentCommand(commentId, userId),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':commentId/like-status')
  async updateLikeStatus(
    @Param('commentId') commentId: string,
    @Body() inputModel: LikeDto,
    @CurrentUserId() user,
  ) {
    const userId = user ? user.sub : '';

    const result: boolean | string = await this.commandBus.execute(
      new LikeCommentCommand(commentId, userId, inputModel),
    );
    return makeAnswerInController(result);
  }
}
