import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Blog, BlogSchema } from './entities/blog.entity';
import { Comment, CommentSchema } from './entities/comment.entity';
import { Post, PostSchema } from './entities/post.entity';
import { Session, SessionSchema } from './entities/session.entity';
import { User, UserSchema } from './entities/user.entity';
import { AuthController } from './public/controllers/auth.controller';
import { BlogController } from './sa/controllers/blog.sa.controller';
import { BlogRepository } from './db/blog.repository';
import { CommentController } from './comment/comment.controller';
import { CommentRepository } from './db/comment.repository';
import { JWTService } from './jwt/jwt.service';
import { PostController } from './post/post.controller';
import { PostRepository } from './db/post.repository';

import { SessionsController } from './session/session.controller';
import { SessionService } from './session/session.service';
import { SessionRepository } from './db/sessions.repository';
import { TestController } from './testing/test.controller';
import { UserController } from './sa/controllers/user.sa.controller';
import { UserRepository } from './db/user.repository';
import { UserService } from './user/user.service';
import { ValidationBlogId } from './validation/validationId';
import { ValidationLoginEmail } from './validation/validationLoginEmail';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './guard/auth-passport/strategy-passport/local.strategy';
import { JwtStrategy } from './guard/auth-passport/strategy-passport/jwt.strategy';
import { MailModule } from './mail/mail.module';
import { AuthRepository } from './db/auth.repository';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BasicStrategy } from './guard/auth-passport/strategy-passport/basic.strategy';
import { GetBlogByBlogIdCase } from './blog/application/use-cases/get-blog-by-blog-id-case';
import { CqrsModule } from '@nestjs/cqrs';
import { GetAllBlogsCase } from './blog/application/use-cases/get-all-blogs-case';
import { CreateBlogCase } from './blogger/blogs/use-cases/create-blog-case';
import { UpdateBlogCase } from './blogger/blogs/use-cases/update-blog-case';
import { DeleteBlogCase } from './blogger/blogs/use-cases/delete-blog-case';
import { CreatePostByBlogIdCase } from './blogger/blogs/use-cases/create-post-by-blog-id-case';
import { GetAllPostsByBlogIdCase } from './post/application/use-cases/get-post-by-blog-id-case';
import { GetAllPostsCase } from './post/application/use-cases/get-all-posts-case';
import { GetPostByIdCase } from './post/application/use-cases/get-post-by-id-case';
import { UpdatePostCase } from './blogger/blogs/use-cases/update-post-case';
import { DeletePostCase } from './blogger/blogs/use-cases/delete-post-case';
import { LikePostCase } from './post/application/use-cases/like-post-case';
import { GetAllCommentsByBlogIdCase } from './comment/application/use-cases/get-all-comments-by-post-id-case';
import { CreateCommentByBlogIdCase } from './comment/application/use-cases/create-comment-by-post-id-case';
import { DeleteCommentCase } from './comment/application/use-cases/delete-comment-case';
import { GetCommentByCommentIdCase } from './comment/application/use-cases/get-comment-by-comment-id-case';
import { LikeCommentCase } from './comment/application/use-cases/like-comment-case';
import { UpdateCommentCase } from './comment/application/use-cases/update-comment-case';
import { DeleteAllSessionsWithoutCurrentCase } from './session/application/use-cases/delete-all-session-without-current-case';
import { DeleteSessionByDeviceIdCase } from './session/application/use-cases/delete-session-by-device-id-case';
import { GetAllSessionsCase } from './session/application/use-cases/get-all-sessions-case';
import { CreateUserCase } from './sa/use-cases/users/create-user-case';
import { GetAllUsersCase } from './sa/use-cases/users/get-all-users-case';
import { DeleteUserCase } from './sa/use-cases/users/delete-user-case';
import { LoginCase } from './auth/application/use-cases/login-case';
import { GetNewTokensCase } from './auth/application/use-cases/get-new-refresh-token-case';
import { LogoutCase } from './auth/application/use-cases/logout-case';
import { GetMeCase } from './auth/application/use-cases/get-me-case';
import { RegistrationCase } from './auth/application/use-cases/registration-case';
import { RegistrationConfirmationCase } from './auth/application/use-cases/registration-confirmation-case';
import { ConfirmPasswordRecoveryCase } from './auth/application/use-cases/confirm-password-recovery-case';
import { PasswordRecoveryCase } from './auth/application/use-cases/password-recovery-case';
import { ResendingEmailCase } from './auth/application/use-cases/resending-email-case';
import { GetCurrentUserBlogsCase } from './blogger/blogs/use-cases/get-current-user-blogs-case';
import { BindBlogWithUserCase } from './sa/use-cases/blogs/bind-blog-with-user-case';

const validations = [ValidationBlogId, ValidationLoginEmail];

const useCasesBlog = [
  CreateBlogCase,
  DeleteBlogCase,
  GetAllBlogsCase,
  GetBlogByBlogIdCase,
  UpdateBlogCase,
  GetCurrentUserBlogsCase,
  BindBlogWithUserCase,
];

const useCasesPost = [
  CreatePostByBlogIdCase,
  DeletePostCase,
  GetAllPostsByBlogIdCase,
  GetAllPostsCase,
  GetPostByIdCase,
  LikePostCase,
  UpdatePostCase,
];

const useCasesComment = [
  CreateCommentByBlogIdCase,
  DeleteCommentCase,
  GetAllCommentsByBlogIdCase,
  GetCommentByCommentIdCase,
  LikeCommentCase,
  UpdateCommentCase,
];

const useCasesSession = [
  DeleteSessionByDeviceIdCase,
  DeleteAllSessionsWithoutCurrentCase,
  GetAllSessionsCase,
];

const useCasesAuth = [
  LoginCase,
  GetNewTokensCase,
  LogoutCase,
  GetMeCase,
  RegistrationCase,
  RegistrationConfirmationCase,
  PasswordRecoveryCase,
  ConfirmPasswordRecoveryCase,
  ResendingEmailCase,
];

const useCasesUser = [CreateUserCase, GetAllUsersCase, DeleteUserCase];

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
    ...strategies /* стратегия */,
    ...useCasesBlog /* кейсы */,
    ...useCasesComment /* кейсы */,
    ...useCasesPost /* кейсы */,
    ...useCasesSession /* кейсы */,
    ...useCasesUser /* кейсы */,
    ...useCasesAuth /* кейсы */,
    ...validations /*валидаторы */,
    AppService,
    AuthRepository,
    BlogRepository,
    CommentRepository,
    JWTService,
    JwtService,
    PostRepository,
    SessionRepository,
    SessionService,
    UserRepository,
    UserService,
  ],
})
export class AppModule {}
