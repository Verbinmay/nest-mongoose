import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [BlogModule, PostModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
