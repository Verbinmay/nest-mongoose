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
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationQuery } from 'src/pagination/base-pagination';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { Tokens } from 'src/decorator/tokens.decorator';
import { ViewPostDto } from './dto/view-post.dto';
import { JWTService } from 'src/jwt/jwt.service';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly jwtService: JWTService,
  ) {}

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

  @Put(':id')
  @HttpCode(204)
  updatePost(@Param('id') id: string, @Body() inputModel: UpdatePostDto) {
    return this.postService.updatePost(id, inputModel);
  }

  @Delete(':id')
  @HttpCode(204)
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
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
    return this.postService.getCommentsByPostId(postId, query, userId);
  }

  @Post(':postId/comments')
  async createCommentByPostId(
    @Param('postId') postId: string,
    @Body() inputModel: CreateCommentDto,
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

    return await this.postService.createCommentByPostId({
      content: inputModel.content,
      userId: userId,
      postId: post.id,
    });
  }
}
