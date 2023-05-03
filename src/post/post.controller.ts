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
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationQuery } from 'src/pagination/base-pagination';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(@Body() inputModel: CreatePostDto) {
    return this.postService.createPost(inputModel);
  }

  @Get()
  findPosts(@Query() query: PaginationQuery) {
    return this.postService.getPosts(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.postService.getPostById(id);
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
  @Get(':postId')
  findCommentsByPostId(
    @Param('postId') postId: string,
    @Query() query: PaginationQuery,
  ) {
    return this.postService.getCommentsByPostId(postId, query);
  }
}
