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
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../guard/auth-passport/guard-passport/basic-auth.guard';
import { JwtAuthGuard } from '../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { LikeDto } from '../likes/dto/like.dto';
import { CurrentUserId } from '../decorator/currentUser.decorator';
import { Tokens } from '../decorator/tokens.decorator';
import { JWTService } from '../jwt/jwt.service';
import { PaginationQuery } from '../pagination/base-pagination';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ViewPostDto } from './dto/view-post.dto';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly jwtService: JWTService,
    private readonly postRepository: PostRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  createPost(@Body() inputModel: CreatePostDto) {
    return this.postService.createPost(inputModel);
  }

  @Get()
  async findPosts(@Query() query: PaginationQuery, @Tokens() tokens) {
    const userId = await this.jwtService.getUserIdFromAccessToken(
      tokens.accessToken,
    );
    return this.postService.getPosts(query, userId);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Tokens() tokens) {
    const userId = await this.jwtService.getUserIdFromAccessToken(
      tokens.accessToken,
    );
    return this.postService.getPostById(id, userId);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  updatePost(@Param('id') id: string, @Body() inputModel: UpdatePostDto) {
    return this.postService.updatePost(id, inputModel);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
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

    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new NotFoundException();
    }

    let myStatusBefore = '';
    const like = post.extendedLikesInfo.find((m) => m.userId === userId);
    if (like) {
      myStatusBefore = like.status;
    }

    if (myStatusBefore === inputModel.likeStatus) {
      return true;
    }

    const postUpdateLikeStatus: boolean =
      await this.postService.updatePostLikeStatus({
        post: post,
        likeStatus: inputModel.likeStatus,
        userId: userId,
      });

    if (!postUpdateLikeStatus) {
      throw new NotFoundException();
    }
    return true;
  }
  //COMMENTS

  @Get(':postId/comments')
  async findCommentsByPostId(
    @Param('postId') postId: string,
    @Query() query: PaginationQuery,
    @Tokens() tokens,
  ) {
    const userId = await this.jwtService.getUserIdFromAccessToken(
      tokens.accessToken,
    );
    const post: ViewPostDto | null = await this.postService.getPostById(
      postId,
      userId,
    );

    if (!post) {
      throw new NotFoundException();
    }
    return this.postService.getCommentsByPostId(postId, query, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async createCommentByPostId(
    @Param('postId') postId: string,
    @Body() inputModel: CreateCommentDto,
    @CurrentUserId() user,
  ) {
    const userId = user ? user.sub : '';
    const post: ViewPostDto | null = await this.postService.getPostById(
      postId,
      userId,
    );

    if (!post) {
      throw new NotFoundException();
    }

    return await this.postService.createCommentByPostId({
      content: inputModel.content,
      userId: userId,
      postId: post.id,
    });
  }
}
