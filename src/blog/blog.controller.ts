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
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PaginationQuery } from 'src/pagination/base-pagination';
import { CreatePostBlogDto } from './dto/create-post-in-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get(':id')
  getBlog(@Param('id') id: string) {
    return this.blogService.getBlogById(id);
  }

  @Get()
  getBlogs(@Query() query: PaginationQuery) {
    return this.blogService.getBlogs(query);
  }

  @Post()
  createBlog(@Body() inputModel: CreateBlogDto) {
    return this.blogService.createBlog(inputModel);
  }

  @Put(':id')
  @HttpCode(204)
  updateBlog(@Param('id') id: string, @Body() inputModel: UpdateBlogDto) {
    return this.blogService.updateBlog(id, inputModel);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteBlog(@Param('id') id: string) {
    return this.blogService.deleteBlog(id);
  }

  //Create ang get post throw blog
  @Post(':blogId/posts')
  createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() inputModel: CreatePostBlogDto,
  ) {
    return this.blogService.createPostByBlogId(blogId, inputModel);
  }

  @Get(':blogId/posts')
  findPostByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: PaginationQuery,
  ) {
    return this.blogService.findPostByBlogId(blogId, query);
  }
}
