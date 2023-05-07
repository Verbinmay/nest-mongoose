import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { Post, PostSchema } from '../post/entities/post.entity';
import { PostRepository } from '../post/post.repository';
import { Blog, BlogSchema } from './entities/blog.entity';
import { BlogController } from './blog.controller';
import { BlogRepository } from './blog.repository';
import { BlogService } from './blog.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.MONGO_NAME,
    }),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository, PostRepository],
})
export class BlogModule {}
