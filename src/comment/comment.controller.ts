import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  NotFoundException,
  ForbiddenException,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { Tokens } from '../decorator/tokens.decorator';
import { LikeDto } from '../dto/like.dto';
import { JWTService } from '../Jwt/jwt.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ViewCommentDto } from './dto/view-comment.dto';
import { CommentService } from './comment.service';

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

  @Delete()
  async deleteComment(@Param('commentId') commentId: string, @Tokens() tokens) {
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

    const commentDelete: boolean = await this.commentService.deleteComment(
      commentFind.id,
    );

    if (!commentDelete) {
      throw new NotFoundException();
    }
    return true;
  }

  @Put(':commentId/like-status')
  @HttpCode(204)
  async updateLikeStatus(
    @Param('commentId') commentId: string,
    @Tokens() tokens,
    @Body() inputModel: LikeDto,
  ) {
    const userId = await this.jwtService.getUserIdFromAccessToken(
      tokens.accessToken,
    );

    const commentFind: ViewCommentDto | null =
      await this.commentService.findById(commentId, userId);

    if (!commentFind) {
      throw new NotFoundException();
    }

    if (commentFind.likesInfo.myStatus === inputModel.likeStatus) {
      return true;
    }

    const commentUpdateLikeStatus: boolean =
      await this.commentService.updateCommentLikeStatus({
        commentId: commentId,
        likeStatus: inputModel.likeStatus,
        userId: userId,
      });

    if (commentUpdateLikeStatus) {
      throw new NotFoundException();
    }
    return true;
  }
}
