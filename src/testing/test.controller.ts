import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Blog, BlogsModelType } from '../blog/entities/blog.entity';
import { Comment, CommentsModelType } from '../comment/entities/comment.entity';
import { Post, PostsModelType } from '../post/entities/post.entity';
import { User, UsersModelType } from '../user/entities/user.entity';

@Controller('testing')
export class TestController {
  constructor(
    @InjectModel(Blog.name)
    private blogsModel: BlogsModelType,
    @InjectModel(Post.name)
    private postsModel: PostsModelType,
    @InjectModel(User.name)
    private usersModel: UsersModelType,
    @InjectModel(Comment.name)
    private commentsModel: CommentsModelType,
  ) {}

  @HttpCode(204)
  @Delete('all-data')
  async deleteAll() {
    await this.blogsModel.deleteMany({});
    await this.postsModel.deleteMany({});
    await this.usersModel.deleteMany({});
    await this.commentsModel.deleteMany({});
    return;
  }
}
