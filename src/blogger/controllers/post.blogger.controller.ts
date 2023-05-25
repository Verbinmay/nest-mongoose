import {
  Controller,
  Post,
  Param,
  Delete,
  Put,
  HttpCode,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CurrentUserId as CurrentPayload } from '../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../helpers/errors';
import { CreatePostBlogDto } from '../dto/post/create-post-in-blog.dto';
import { UpdatePostByBlogDto } from '../dto/post/update-post-by-blog.dto';
import { CreatePostByBlogIdCommand } from '../use-cases/post/create-post-by-blog-id-case';
import { DeletePostCommand } from '../use-cases/post/delete-post-case';
import { UpdatePostCommand } from '../use-cases/post/update-post-case';

@Controller('blogger/blogs')
export class PostBloggersController {
  constructor(private commandBus: CommandBus) {}

  //Create ang get post throw blog
  @UseGuards(JwtAuthGuard)
  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() inputModel: CreatePostBlogDto,
    @CurrentPayload() user,
  ) {
    const userId = user ? user.sub : '';
    const result = await this.commandBus.execute(
      new CreatePostByBlogIdCommand(blogId, userId, inputModel),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':blogId/posts/:postId')
  async updatePostByBlogId(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() inputModel: UpdatePostByBlogDto,
    @CurrentPayload() user,
  ) {
    const userId: string = user ? user.sub : '';

    const result: boolean | string = await this.commandBus.execute(
      new UpdatePostCommand(blogId, postId, userId, inputModel),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':blogId/posts/:postId')
  async deletePostByBlogId(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @CurrentPayload() user,
  ) {
    const userId: string = user ? user.sub : '';

    const result: boolean | string = await this.commandBus.execute(
      new DeletePostCommand(blogId, postId, userId),
    );
    return makeAnswerInController(result);
  }
}
