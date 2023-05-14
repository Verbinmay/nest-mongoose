import mongoose, { HydratedDocument, Model, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CreatePostBlogDto } from '../../blog/dto/create-post-in-blog.dto';
import { like, likeSchema } from '../../likes/entities/like.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { ViewPostDto } from '../dto/view-post.dto';

@Schema()
export class Post {
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

  @Prop({ default: new Types.ObjectId(), type: mongoose.Schema.Types.ObjectId })
  public _id: Types.ObjectId = new Types.ObjectId();

  @Prop({ default: new Date().toISOString() })
  public createdAt: string = new Date().toISOString();

  @Prop({ default: new Date().toISOString() })
  public updatedAt: string = new Date().toISOString();

  @Prop({ default: [], type: [likeSchema] })
  public extendedLikesInfo: Array<like> = [];

  updateInfo(inputModel: UpdatePostDto, blogName: string) {
    this.title = inputModel.title;
    this.shortDescription = inputModel.shortDescription;
    this.content = inputModel.content;
    this.content = inputModel.content;
    this.blogId = inputModel.blogId;
    this.blogName = blogName;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  getViewModel(userId: string): ViewPostDto {
    let status: 'None' | 'Like' | 'Dislike' = 'None';
    let likesCount = 0;
    let dislikeCount = 0;
    let newestLikes = [];
    if (this.extendedLikesInfo.length !== 0) {
      status = this.extendedLikesInfo.find((m) => m.userId === userId).status;

      likesCount = this.extendedLikesInfo.filter(
        (m) => m.status === 'Like',
      ).length;

      dislikeCount = this.extendedLikesInfo.filter(
        (m) => m.status === 'Dislike',
      ).length;

      newestLikes = this.extendedLikesInfo
        .filter((m) => m.status === 'Like')
        .sort((a, b) => {
          const dateA = new Date(a.addedAt).getTime();
          const dateB = new Date(b.addedAt).getTime();
          return dateA - dateB;
        })
        .slice(-3);
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

  static createPost(
    blogName: string,
    inputModel: CreatePostBlogDto | CreatePostDto,
    blogId?: string,
  ): Post {
    const post = new Post();
    post.title = inputModel.title;
    post.shortDescription = inputModel.shortDescription;
    post.content = inputModel.content;
    post.blogName = blogName;

    if ('blogId' in inputModel) {
      post.blogId = inputModel.blogId;
    } else {
      post.blogId = blogId;
    }

    return post;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.methods = {
  updateInfo: Post.prototype.updateInfo,
  getViewModel: Post.prototype.getViewModel,
};

PostSchema.statics = {
  createBlog: Post.createPost,
};

export type PostsDocument = HydratedDocument<Post>;

export type PostsModelStaticType = {
  createBlog: (
    blogName: string,
    inputModel: CreatePostBlogDto | CreatePostDto,
    blogId?: string,
  ) => PostsDocument;
};
export type PostsModelMethodsType = {
  updateInfo: (inputModel: UpdatePostDto, blogName: string) => Post;
  getViewModel: (userId: string) => ViewPostDto;
};

export type PostsModelType = Model<PostsDocument> &
  PostsModelStaticType &
  PostsModelMethodsType;
