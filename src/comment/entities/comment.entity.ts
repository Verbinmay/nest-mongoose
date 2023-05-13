import mongoose, { HydratedDocument, Model, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ViewCommentDto } from '../dto/view-comment.dto';

@Schema()
export class like {
  @Prop() addedAt: string;
  @Prop() userId: string;
  @Prop() login: string;
}
export const likeSchema = SchemaFactory.createForClass(like);

@Schema()
export class likesInfo {
  @Prop({ default: [], type: [likeSchema] })
  likesCount: Array<like>;
  @Prop({ default: [], type: [likeSchema] })
  dislikesCount: Array<like>;
  @Prop({ default: 'NaN', required: true })
  myStatus: string;
  @Prop({ default: [], type: [likeSchema] })
  newestLikes: Array<like>;
}
export const likesInfoSchema = SchemaFactory.createForClass(likesInfo);

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

  @Prop({ required: true, type: likesInfoSchema })
  public likesInfo: likesInfo;

  getViewModel(userId: string): ViewCommentDto {
    const likeArr = this.likesInfo.likesCount.filter(
      (m) => m?.userId === userId,
    ).length;
    const dislikeArr = this.likesInfo.dislikesCount.filter(
      (m) => m?.userId === userId,
    ).length;

    let status = '';
    if (likeArr === dislikeArr) {
      status = 'None';
    } else if (likeArr > dislikeArr) {
      status = 'Like';
    } else {
      status = 'Dislike';
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
        likesCount: this.likesInfo.likesCount.length,
        dislikesCount: this.likesInfo.dislikesCount.length,
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
    comment.likesInfo = new likesInfo();
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
