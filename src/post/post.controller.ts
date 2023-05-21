import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { BasicAuthGuard } from '../guard/auth-passport/guard-passport/basic-auth.guard';
import { JwtAuthGuard } from '../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { LikeDto } from '../likes/dto/like.dto';
import { PostCommentByBlogIdCommand } from '../comment/application/use-cases/create-comment-by-post-id-case';
import { CreatePostCommand } from './application/use-cases/create-post-case';
import { DeletePostCommand } from '../blogger/blogs/use-cases/delete-post-case';
import { GetAllCommentsByBlogIdCommand } from '../comment/application/use-cases/get-all-comments-by-post-id-case';
import { GetAllPostsCommand } from './application/use-cases/get-all-posts-case';
import { GetPostByIdCommand } from './application/use-cases/get-post-by-id-case';
import { LikePostCommand } from './application/use-cases/like-post-case';
import { UpdatePostCommand } from '../blogger/blogs/use-cases/update-post-case';
import { CurrentUserId } from '../decorator/currentUser.decorator';
import { makeAnswerInController } from '../helpers/errors';
import { PaginationQuery } from '../pagination/base-pagination';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(@Body() inputModel: CreatePostDto, @CurrentUserId() user) {
    const userId = user ? user.sub : '';
    const result = await this.commandBus.execute(
      new CreatePostCommand(userId, inputModel),
    );
    return makeAnswerInController(result);
  }

  @Get()
  async getAllPosts(@Query() query: PaginationQuery, @CurrentUserId() user) {
    const userId = user ? user.sub : '';
    const result = await this.commandBus.execute(
      new GetAllPostsCommand(userId, query),
    );
    return makeAnswerInController(result);
  }

  @Get(':id')
  async GetPostById(@Param('id') id: string, @CurrentUserId() user) {
    const userId = user ? user.sub : '';
    const result = await this.commandBus.execute(
      new GetPostByIdCommand(id, userId),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updatePost(@Param('id') id: string, @Body() inputModel: UpdatePostDto) {
    const result = await this.commandBus.execute(
      new UpdatePostCommand(id, inputModel),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string) {
    const result = await this.commandBus.execute(new DeletePostCommand(id));
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':postId/like-status')
  @HttpCode(204)
  async updateLikeStatus(
    @Param('postId') postId: string,
    @Body() inputModel: LikeDto,
    @CurrentUserId() user,
  ) {
    const userId = user ? user.sub : '';

    const result = await this.commandBus.execute(
      new LikePostCommand(postId, userId, inputModel),
    );

    return makeAnswerInController(result);
  }

  @Get(':postId/comments')
  async getCommentsByPostId(
    @Param('postId') postId: string,
    @Query() query: PaginationQuery,
    @CurrentUserId() user,
  ) {
    const userId = user ? user.sub : '';

    const result = await this.commandBus.execute(
      new GetAllCommentsByBlogIdCommand(postId, userId, query),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async createCommentByPostId(
    @Param('postId') postId: string,
    @Body() inputModel: CreateCommentDto,
    @CurrentUserId() user,
  ) {
    const userId = user ? user.sub : '';

    const result = await this.commandBus.execute(
      new PostCommentByBlogIdCommand(postId, userId, inputModel),
    );
    return makeAnswerInController(result);
  }
}
