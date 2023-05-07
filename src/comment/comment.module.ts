import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { User, UserSchema } from '../user/entities/user.entity';
import { JWTService } from '../jwt/jwt.service';
import { UserRepository } from '../user/user.repository';
import { Comment, CommentSchema } from './entities/comment.entity';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    CommentRepository,
    UserRepository,
    JWTService,
    JwtService,
  ],
})
export class CommentModule {}
