import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Blog, BlogSchema } from '../blog/entities/blog.entity';
import { Comment, CommentSchema } from '../comment/entities/comment.entity';
import { Post, PostSchema } from '../post/entities/post.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { BlogRepository } from '../blog/blog.repository';
import { CommentRepository } from '../comment/comment.repository';
import { PostRepository } from '../post/post.repository';
import { PostService } from '../post/post.service';
import { UserRepository } from '../user/user.repository';
import { TestController } from './test.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TestController],
  providers: [
    PostService,
    PostRepository,
    BlogRepository,
    CommentRepository,
    UserRepository,
  ],
})
export class TestModule {}
