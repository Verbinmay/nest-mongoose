import mongoose, { HydratedDocument, Model, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { like, likeSchema } from '../../likes/entities/like.entity';
import { ViewCommentDto } from '../dto/view-comment.dto';

@Schema()
export class CommentatorInfo {
  constructor(userId: string, userLogin: string) {
    this.userId = userId;
    this.userLogin = userLogin;
  }
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  userLogin: string;
}

export const commentatorInfoSchema =
  SchemaFactory.createForClass(CommentatorInfo);

@Schema()
export class Comment {
  @Prop({ required: true })
  public content: string;

  @Prop({ type: commentatorInfoSchema, required: true })
  public commentatorInfo: CommentatorInfo;

  @Prop({ required: true })
  public postId: string;

  @Prop({ default: new Types.ObjectId(), type: mongoose.Schema.Types.ObjectId })
  public _id: Types.ObjectId = new Types.ObjectId();

  @Prop({ default: new Date().toISOString() })
  public createdAt: string = new Date().toISOString();

  @Prop({ default: new Date().toISOString() })
  public updatedAt: string = new Date().toISOString();

  @Prop({ default: [], type: [likeSchema] })
  public likesInfo: Array<like> = [];

  getViewModel(userId: string): ViewCommentDto {
    let status: 'None' | 'Like' | 'Dislike' = 'None';
    let likesCount = 0;
    let dislikeCount = 0;
    if (this.likesInfo.length !== 0) {
      const like = this.likesInfo.find((m) => m.userId === userId);
      if (like) status = like.status;

      likesCount = this.likesInfo.filter((m) => m?.status === 'Like').length;

      dislikeCount = this.likesInfo.filter(
        (m) => m?.status === 'Dislike',
      ).length;
    }

    const result: ViewCommentDto = {
      id: this._id.toString(),
      content: this.content,
      commentatorInfo: {
        userId: this.commentatorInfo.userId,
        userLogin: this.commentatorInfo.userLogin,
      },
      createdAt: this.createdAt,
      likesInfo: {
        likesCount: likesCount,
        dislikesCount: dislikeCount,
        myStatus: status,
      },
    };

    return result;
  }

  static createComment(a: {
    content: string;
    userId: string;
    userLogin: string;
    postId: string;
  }): Comment {
    const comment = new Comment();

    comment.content = a.content;
    comment.postId = a.postId;

    comment.commentatorInfo = new CommentatorInfo(a.userId, a.userLogin);
    return comment;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.methods = {
  getViewModel: Comment.prototype.getViewModel,
};

CommentSchema.statics = {
  createComment: Comment.createComment,
};

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelStaticType = {
  createComment: (inputModel: {
    content: string;
    userId: string;
    userLogin: string;
    postId: string;
  }) => CommentDocument;
};
export type CommentModelMethodsType = {
  getViewModel: () => ViewCommentDto;
};

export type CommentsModelType = Model<CommentDocument> &
  CommentModelStaticType &
  CommentModelMethodsType;
