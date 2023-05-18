import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { Blog, BlogSchema } from './blog/entities/blog.entity';
import { Comment, CommentSchema } from './comment/entities/comment.entity';
import { Post, PostSchema } from './post/entities/post.entity';
import { Session, SessionSchema } from './session/entities/session.entity';
import { User, UserSchema } from './user/entities/user.entity';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { BlogController } from './blog/blog.controller';
import { BlogRepository } from './blog/blog.repository';
import { BlogService } from './blog/application/blog.service';
import { CommentController } from './comment/comment.controller';
import { CommentRepository } from './comment/comment.repository';
import { CommentService } from './comment/comment.service';
import { JWTService } from './jwt/jwt.service';
import { PostController } from './post/post.controller';
import { PostRepository } from './post/post.repository';
import { PostService } from './post/post.service';

import { SessionsController } from './session/session.controller';
import { SessionService } from './session/session.service';
import { SessionRepository } from './session/sessions.repository';
import { TestController } from './testing/test.controller';
import { UserController } from './user/user.controller';
import { UserRepository } from './user/user.repository';
import { UserService } from './user/user.service';
import { ValidationBlogId } from './validation/validationId';
import { ValidationLoginEmail } from './validation/validationLoginEmail';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './guard/auth-passport/strategy-passport/local.strategy';
import { JwtStrategy } from './guard/auth-passport/strategy-passport/jwt.strategy';
import { MailModule } from './mail/mail.module';
import { AuthRepository } from './auth/auth.repository';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BasicStrategy } from './guard/auth-passport/strategy-passport/basic.strategy';
import { GetBlogByBlogIdCase } from './blog/application/use-cases/get-blog-by-blog-id-case';
import { CqrsModule } from '@nestjs/cqrs';
import { GetAllBlogsCase } from './blog/application/use-cases/get-all-blogs-case';
import { CreateBlogCase } from './blog/application/use-cases/create-blog-case';

const validations = [ValidationBlogId, ValidationLoginEmail];

const useCases = [GetBlogByBlogIdCase, GetAllBlogsCase, CreateBlogCase];

const strategies = [BasicStrategy, JwtStrategy, LocalStrategy];

@Module({
  imports: [
    /* для использования одноименной функции в nest, command bus */
    CqrsModule,

    /* и еще в провайдерах регистрировать каждую стратегию */
    PassportModule,

    /*почта */
    MailModule,

    /* главное, чтобы подтягивались env нужно вызвать сверху  */
    ConfigModule.forRoot({
      // no need to import into other modules
      isGlobal: true,
    }),
    //
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.MONGO_NAME,
    }),
    //
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
      { name: Session.name, schema: SessionSchema },
      { name: User.name, schema: UserSchema },
    ]),

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    BlogController,
    CommentController,
    PostController,
    SessionsController,
    TestController,
    UserController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    JwtService,
    AppService,
    AuthRepository,
    AuthService,
    BlogRepository,
    BlogService,
    CommentRepository,
    CommentService,
    JWTService,
    PostRepository,
    PostService,
    SessionRepository,
    SessionService,
    UserRepository,
    UserService,
    ...validations /*валидаторы */,
    ...useCases /* кейсы */,
    ...strategies /* стратегия */,
  ],
})
export class AppModule {}
