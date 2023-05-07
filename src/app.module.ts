import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { BlogModule } from './blog/blog.module';
import { CommentModule } from './comment/comment.module';
import { PostModule } from './post/post.module';
import { TestModule } from './testing/test.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.MONGO_NAME,
    }),
    BlogModule,
    PostModule,
    CommentModule,
    UserModule,
    TestModule,
    // MongooseModule.forFeature([
    //   { name: Post.name, schema: PostSchema },
    //   { name: User.name, schema: UserSchema },
    //   { name: Comment.name, schema: CommentSchema },
    // ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
