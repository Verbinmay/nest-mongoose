import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';
import { Tokens } from 'src/decorator/tokens.decorator';
import { JWTService } from 'src/jwt/jwt.service';
import { ViewCommentDto } from './dto/view-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly jwtService: JWTService,
  ) {}

  @Get()
  async findById(@Param('id') id: string, @Tokens() tokens) {
    const userId = await this.jwtService.getUserIdFromAccessToken(
      tokens.accessToken,
    );
    return this.commentService.findById(id, userId);
  }

  @Put()
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() inputModel: UpdateCommentDto,
    @Tokens() tokens,
  ) {
    const userId = await this.jwtService.getUserIdFromAccessToken(
      tokens.accessToken,
    );
    const commentFind: ViewCommentDto | null =
      await this.commentService.findById(commentId, userId);
    if (!commentFind) {
      throw new NotFoundException();
    }

    if (commentFind.commentatorInfo.userId !== userId) {
      throw new ForbiddenException();
    }

    const commentUpdate: boolean = await this.commentService.updateComment({
      commentId: commentId,
      content: inputModel.content,
    });

    if (!commentUpdate) {
      throw new NotFoundException();
    }
    return true;
  }
}
