import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { ViewCommentDto } from '../dto/view-comment.dto';

@Schema()
export class LikesInfo {
  @Prop({ required: true })
  likesCount: string[];
  @Prop({ required: true })
  dislikesCount: string[];
  @Prop({ required: true })
  myStatus: string;
}

export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);

@Schema()
export class CommentatorInfo {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  userLogin: string;
}

export const commentatorInfoSchema =
  SchemaFactory.createForClass(CommentatorInfo);

@Schema()
export class Comment {
  @Prop({ default: new Types.ObjectId(), type: mongoose.Schema.Types.ObjectId })
  public _id: Types.ObjectId = new Types.ObjectId();

  @Prop({ required: true })
  public content: string;

  @Prop({ type: commentatorInfoSchema, required: true })
  public commentatorInfo: CommentatorInfo;

  @Prop({ default: new Date().toISOString() })
  public createdAt: string = new Date().toISOString();

  @Prop({ default: new Date().toISOString() })
  public updatedAt: string = new Date().toISOString();

  @Prop({ required: true })
  public postId: string;

  @Prop({ type: LikesInfoSchema, required: true })
  public likesInfo: LikesInfo;

  // updateInfo(inputModel: BlogInputModel) {
  //   this.name = inputModel.name;
  //   this.description = inputModel.description;
  //   this.websiteUrl = inputModel.websiteUrl;
  //   this.updatedAt = new Date().toISOString();
  //   return this;
  // }

  getViewModel(userId: string): ViewCommentDto {
    const likeArr = this.likesInfo.likesCount.indexOf(userId);
    const dislikeArr = this.likesInfo.dislikesCount.indexOf(userId);

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
    comment.commentatorInfo.userId = a.userId;
    comment.commentatorInfo.userLogin = a.userLogin;
    comment.postId = a.postId;

    return comment;
  }
}

export const CommentSchema = SchemaFactory.createForClass(CommentatorInfo);

CommentSchema.methods = {
  // updateInfo: Blog.prototype.updateInfo,
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
  // updateInfo: (inputModel: BlogInputModel) => Blog;
  getViewModel: () => ViewCommentDto;
};

export type CommentModelType = Model<CommentDocument> &
  CommentModelStaticType &
  CommentModelMethodsType;
