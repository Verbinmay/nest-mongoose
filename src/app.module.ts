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
import { BlogRepository } from './db/blog.repository';
import { CommentController } from './public/controllers/comment.controller';
import { CommentRepository } from './db/comment.repository';
import { JWTService } from './jwt/jwt.service';
import { PostController } from './public/controllers/post.controller';
import { PostRepository } from './db/post.repository';
import { SessionsController } from './public/controllers/session.controller';
import { SessionService } from './public/services/session.service';
import { SessionRepository } from './db/sessions.repository';
import { TestController } from './public/controllers/test.controller';
import { ValidationBlogId } from './validation/validationBlogId';
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
import { CqrsModule } from '@nestjs/cqrs';
import { BlogBloggersController } from './blogger/controllers/blog.blogger.controller';
import { UserSAController } from './sa/controllers/user.sa.controller';
import { UserRepository } from './db/user.repository';
import { BlogController } from './public/controllers/blog.controller';
import { ConfirmPasswordRecoveryCase } from './public/use-cases/auth/confirm-password-recovery-case';
import { GetMeCase } from './public/use-cases/auth/get-me-case';
import { GetNewTokensCase } from './public/use-cases/auth/get-new-refresh-token-case';
import { LoginCase } from './public/use-cases/auth/login-case';
import { LogoutCase } from './public/use-cases/auth/logout-case';
import { PasswordRecoveryCommand } from './public/use-cases/auth/password-recovery-case';
import { RegistrationCase } from './public/use-cases/auth/registration-case';
import { RegistrationConfirmationCase } from './public/use-cases/auth/registration-confirmation-case';
import { ResendingEmailCase } from './public/use-cases/auth/resending-email-case';
import { GetAllBlogsCase } from './public/use-cases/blog/get-all-blogs-case';
import { GetBlogByBlogIdCase } from './public/use-cases/blog/get-blog-by-blog-id-case';
import { CreateCommentByBlogIdCase } from './public/use-cases/comment/create-comment-by-post-id-case';
import { DeleteCommentCase } from './public/use-cases/comment/delete-comment-case';
import { GetAllCommentsByBlogIdCase } from './public/use-cases/comment/get-all-comments-by-post-id-case';
import { GetCommentByCommentIdCase } from './public/use-cases/comment/get-comment-by-comment-id-case';
import { LikeCommentCase } from './public/use-cases/comment/like-comment-case';
import { UpdateCommentCase } from './public/use-cases/comment/update-comment-case';
import { GetAllPostsCase } from './public/use-cases/post/get-all-posts-case';
import { GetAllPostsByBlogIdCase } from './public/use-cases/post/get-post-by-blog-id-case';
import { GetPostByIdCase } from './public/use-cases/post/get-post-by-id-case';
import { LikePostCase } from './public/use-cases/post/like-post-case';
import { DeleteAllSessionsWithoutCurrentCase } from './public/use-cases/session/delete-all-session-without-current-case';
import { DeleteSessionByDeviceIdCase } from './public/use-cases/session/delete-session-by-device-id-case';
import { GetAllSessionsCase } from './public/use-cases/session/get-all-sessions-case';
import { BlogSAController } from './sa/controllers/blog.sa.controller';
import { SA_BindBlogWithUserCase } from './sa/use-cases/blogs/sa-bind-blog-with-user-case';
import { SA_GetAllBlogsCase } from './sa/use-cases/blogs/sa-get-all-blogs-case';
import { SA_BanUserCase } from './sa/use-cases/users/sa-ban-user-case';
import { SA_CreateUserCase } from './sa/use-cases/users/sa-create-user-case';
import { SA_DeleteUserCase } from './sa/use-cases/users/sa-delete-user-case';
import { SA_GetAllUsersCase } from './sa/use-cases/users/sa-get-all-users-case';
import { CreateBlogCase } from './blogger/use-cases/blog/create-blog-case';
import { DeleteBlogCase } from './blogger/use-cases/blog/delete-blog-case';
import { GetCurrentUserBlogsCase } from './blogger/use-cases/blog/get-current-user-blogs-case';
import { UpdateBlogCase } from './blogger/use-cases/blog/update-blog-case';
import { CreatePostByBlogIdCase } from './blogger/use-cases/post/create-post-by-blog-id-case';
import { DeletePostCase } from './blogger/use-cases/post/delete-post-case';
import { UpdatePostCase } from './blogger/use-cases/post/update-post-case';
import { GetCommentsWithPostInfoByUserIdCase } from './blogger/use-cases/comment/get-comments-with-post-info-for-current-user';
import { CommentBloggersController } from './blogger/controllers/comment.blogger.controller';
import { PostBloggersController } from './blogger/controllers/post.blogger.controller';
import { UserBloggersController } from './blogger/controllers/user.blogger.controller';
import { BanUserForBlogByUserIdCase } from './blogger/use-cases/user/ban-user-for-blog-case';

const validations = [ValidationBlogId, ValidationLoginEmail];

const useCasesBlog = [
  CreateBlogCase,
  DeleteBlogCase,
  GetAllBlogsCase,
  GetBlogByBlogIdCase,
  GetCurrentUserBlogsCase,
  SA_BindBlogWithUserCase,
  SA_BanUserCase,
  SA_CreateUserCase,
  SA_DeleteUserCase,
  SA_GetAllBlogsCase,
  SA_GetAllUsersCase,
  UpdateBlogCase,
  BanUserForBlogByUserIdCase,
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
  GetCommentsWithPostInfoByUserIdCase,
  LikeCommentCase,
  UpdateCommentCase,
];

const useCasesSession = [
  DeleteAllSessionsWithoutCurrentCase,
  DeleteSessionByDeviceIdCase,
  GetAllSessionsCase,
];

const useCasesAuth = [
  ConfirmPasswordRecoveryCase,
  GetMeCase,
  GetNewTokensCase,
  LoginCase,
  LogoutCase,
  PasswordRecoveryCommand,
  RegistrationCase,
  RegistrationConfirmationCase,
  ResendingEmailCase,
];

const useCasesUser = [];

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

    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 10,
    // }),
  ],
  controllers: [
    AppController,
    AuthController,
    BlogBloggersController,
    BlogController,
    BlogSAController,
    CommentBloggersController,
    CommentController,
    PostBloggersController,
    PostController,
    SessionsController,
    TestController,
    UserBloggersController,
    UserSAController,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
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
  ],
})
export class AppModule {}
