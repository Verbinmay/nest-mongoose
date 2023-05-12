import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Query,
  Put,
  HttpCode,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../guard/auth-pasport/guard-pasport/basic-auth.guard';
import { PaginationQuery } from '../pagination/base-pagination';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CreatePostBlogDto } from './dto/create-post-in-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogService } from './blog.service';

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

  @UseGuards(BasicAuthGuard)
  @Post()
  createBlog(@Body() inputModel: CreateBlogDto) {
    return this.blogService.createBlog(inputModel);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  updateBlog(@Param('id') id: string, @Body() inputModel: UpdateBlogDto) {
    return this.blogService.updateBlog(id, inputModel);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  deleteBlog(@Param('id') id: string) {
    return this.blogService.deleteBlog(id);
  }

  //Create ang get post throw blog
  @UseGuards(BasicAuthGuard)
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
