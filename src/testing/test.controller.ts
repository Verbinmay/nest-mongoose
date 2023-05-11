import {
  RequestCount,
  RequestCountsModelType as RequestCountModelType,
} from '../request-count/entities/requestCount.entity';
import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Blog, BlogsModelType } from '../blog/entities/blog.entity';
import { Comment, CommentsModelType } from '../comment/entities/comment.entity';
import { Post, PostsModelType } from '../post/entities/post.entity';
import { Session, SessionModelType } from '../session/entities/session.entity';
import { User, UserModelType } from '../user/entities/user.entity';

@Controller('testing')
export class TestController {
  constructor(
    @InjectModel(Blog.name)
    private blogsModel: BlogsModelType,
    @InjectModel(Comment.name)
    private commentsModel: CommentsModelType,
    @InjectModel(Post.name)
    private postsModel: PostsModelType,
    @InjectModel(Session.name)
    private sessionsModel: SessionModelType,
    @InjectModel(RequestCount.name)
    private requestCount: RequestCountModelType,
    @InjectModel(User.name)
    private usersModel: UserModelType,
  ) {}

  @HttpCode(204)
  @Delete('all-data')
  async deleteAll() {
    await this.blogsModel.deleteMany({});
    await this.postsModel.deleteMany({});
    await this.usersModel.deleteMany({});
    await this.commentsModel.deleteMany({});
    await this.requestCount.deleteMany({});
    await this.sessionsModel.deleteMany({});
    return;
  }
}
