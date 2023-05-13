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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guard/auth-pasport/guard-pasport/jwt-auth.guard';
import { LikeDto } from '../likes/dto/like.dto';
import { CurrentUserId } from '../decorator/currentUser.decorator';
import { Tokens } from '../decorator/tokens.decorator';
import { JWTService } from '../Jwt/jwt.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ViewCommentDto } from './dto/view-comment.dto';
import { CommentDocument, CommentsModelType } from './entities/comment.entity';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly commentRepository: CommentRepository,
    private readonly jwtService: JWTService,
  ) {}

  @Get()
  async findById(@Param('id') id: string, @Tokens() tokens) {
    const userId = await this.jwtService.getUserIdFromAccessToken(
      tokens.accessToken,
    );

    return this.commentService.findById(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() inputModel: UpdateCommentDto,
    @CurrentUserId() user,
  ) {
    const userId = user.sub;
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

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteComment(
    @Param('commentId') commentId: string,
    @CurrentUserId() user,
  ) {
    const userId = user.sub;
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

  @UseGuards(JwtAuthGuard)
  @Put(':commentId/like-status')
  @HttpCode(204)
  async updateLikeStatus(
    @Param('commentId') commentId: string,
    @Body() inputModel: LikeDto,
    @CurrentUserId() user,
  ) {
    const userId = user.sub;

    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new NotFoundException();
    }

    const commentViewModel = comment.getViewModel(userId);

    if (commentViewModel.likesInfo.myStatus === inputModel.likeStatus) {
      return true;
    }

    const commentUpdateLikeStatus: boolean =
      await this.commentService.updateCommentLikeStatus({
        comment: comment,
        likeStatus: inputModel.likeStatus,
        userId: userId,
      });

    if (commentUpdateLikeStatus) {
      throw new NotFoundException();
    }
    return true;
  }
}
