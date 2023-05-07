import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { Blog, BlogSchema } from '../blog/entities/blog.entity';
import { Comment, CommentSchema } from '../comment/entities/comment.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { BlogRepository } from '../blog/blog.repository';
import { CommentRepository } from '../comment/comment.repository';
import { JWTService } from '../jwt/jwt.service';
import { UserRepository } from '../user/user.repository';
import { Post, PostSchema } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    BlogRepository,
    CommentRepository,
    UserRepository,
    JWTService,
    JwtService,
  ],
})
export class PostModule {}
