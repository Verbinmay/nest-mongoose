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
import { CommandBus } from '@nestjs/cqrs';

import { BasicAuthGuard } from '../guard/auth-passport/guard-passport/basic-auth.guard';
import { GetBlogByBlogIdCommand } from './application/use-cases/get-blog-by-blog-id-case';
import { CurrentUserId } from '../decorator/currentUser.decorator';
import { makeAnswerInController } from '../helpers/errors';
import { PaginationQuery } from '../pagination/base-pagination';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CreatePostBlogDto } from './dto/create-post-in-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogService } from './blog.service';

@Controller('blogs')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private commandBus: CommandBus,
  ) {}

  @Get(':id')
  async getBlogByBlogId(@Param('id') id: string) {
    const result = await this.commandBus.execute(
      new GetBlogByBlogIdCommand(id),
    );
    return makeAnswerInController(result);
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
    @CurrentUserId() user,
  ) {
    const userId = user ? user.sub : '';

    return this.blogService.createPostByBlogId(blogId, userId, inputModel);
  }

  @Get(':blogId/posts')
  findPostByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: PaginationQuery,
    @CurrentUserId() user,
  ) {
    const userId = user ? user.sub : '';

    return this.blogService.findPostByBlogId(blogId, userId, query);
  }
}
