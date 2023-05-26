import mongoose, { HydratedDocument, Model, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CreatePostBlogDto } from '../blogger/dto/post/create-post-in-blog.dto';
import { UpdatePostByBlogDto } from '../blogger/dto/post/update-post-by-blog.dto';
import { ViewPostDto } from '../public/dto/post/view-post.dto';
import { like, likeSchema } from './like.entity';

@Schema()
export class Post {
  constructor(
    blogId: string,
    blogName: string,
    userId: string,
    inputModel: CreatePostBlogDto,
  ) {
    this.title = inputModel.title;
    this.shortDescription = inputModel.shortDescription;
    this.content = inputModel.content;
    this.blogName = blogName;
    this.blogId = blogId;
    this.userId = userId;
  }

  @Prop({ required: true })
  public title: string;
  @Prop({ required: true })
  public shortDescription: string;
  @Prop({ required: true })
  public content: string;
  @Prop({ required: true })
  public blogId: string;
  @Prop({ required: true })
  public blogName: string;
  @Prop({ required: true })
  public userId: string;

  @Prop({ type: Boolean, default: false })
  public isBaned = false;
  @Prop({ default: new Types.ObjectId(), type: mongoose.Schema.Types.ObjectId })
  public _id: Types.ObjectId = new Types.ObjectId();

  @Prop({ default: new Date().toISOString() })
  public createdAt: string = new Date().toISOString();

  @Prop({ default: new Date().toISOString() })
  public updatedAt: string = new Date().toISOString();

  @Prop({ default: [], type: [likeSchema] })
  public extendedLikesInfo: Array<like> = [];

  updateInfo(inputModel: UpdatePostByBlogDto) {
    this.title = inputModel.title;
    this.shortDescription = inputModel.shortDescription;
    this.content = inputModel.content;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  getViewModel(userId: string): ViewPostDto {
    let status: 'None' | 'Like' | 'Dislike' = 'None';
    let likesCount = 0;
    let dislikeCount = 0;
    let newestLikes = [];
    if (this.extendedLikesInfo.length !== 0) {
      const like = this.extendedLikesInfo.find((m) => m.userId === userId);
      if (like) status = like.status;

      likesCount = this.extendedLikesInfo.filter(
        (m) => m.status === 'Like' && m.isBaned === false,
      ).length;

      dislikeCount = this.extendedLikesInfo.filter(
        (m) => m.status === 'Dislike' && m.isBaned === false,
      ).length;

      newestLikes = this.extendedLikesInfo
        .filter((m) => m.status === 'Like' && m.isBaned === false)
        .sort((a, b) => {
          const dateA = new Date(a.addedAt).getTime();
          const dateB = new Date(b.addedAt).getTime();
          return dateA - dateB;
        })
        .slice(-3)
        .map((a) => {
          return {
            addedAt: a.addedAt,
            userId: a.userId,
            login: a.login,
          };
        })
        .reverse();
    }
    const result = {
      id: this._id.toString(),
      title: this.title,
      shortDescription: this.shortDescription,
      content: this.content,
      blogId: this.blogId,
      blogName: this.blogName,
      createdAt: this.createdAt,
      extendedLikesInfo: {
        likesCount: likesCount,
        dislikesCount: dislikeCount,
        myStatus: status,
        newestLikes: newestLikes,
      },
    };
    return result;
  }

  // static createPost(
  //   blogName: string,
  //   inputModel: CreatePostBlogDto,
  //   blogId: string,
  // ): Post {
  //   const post = new Post();
  //   post.title = inputModel.title;
  //   post.shortDescription = inputModel.shortDescription;
  //   post.content = inputModel.content;
  //   post.blogName = blogName;
  //   post.blogId = blogId;

  //   return post;
  // }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.methods = {
  updateInfo: Post.prototype.updateInfo,
  getViewModel: Post.prototype.getViewModel,
};

PostSchema.statics = {
  // createBlog: Post.createPost,
};

export type PostsDocument = HydratedDocument<Post>;

export type PostsModelStaticType = {
  // createBlog: (
  //   blogName: string,
  //   inputModel: CreatePostBlogDto | CreatePostDto,
  //   blogId?: string,
  // ) => PostsDocument;
};
export type PostsModelMethodsType = {
  updateInfo: (inputModel: UpdatePostByBlogDto) => Post;
  getViewModel: (userId: string) => ViewPostDto;
};

export type PostsModelType = Model<PostsDocument> &
  PostsModelStaticType &
  PostsModelMethodsType;
