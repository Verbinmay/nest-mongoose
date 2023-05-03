import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { UpdatePostDto } from '../dto/update-post.dto';
import { ViewPostDto } from '../dto/view-post.dto';
import { CreatePostBlogDto } from 'src/blog/dto/create-post-in-blog.dto';
import { CreatePostDto } from '../dto/create-post.dto';

@Schema()
export class likeInfo {
  @Prop() addedAt: string;
  @Prop() userId: string;
  @Prop() login: string;
}
export const likeInfoSchema = SchemaFactory.createForClass(likeInfo);

@Schema()
export class extendedLikesInfo {
  @Prop({ default: [], type: [likeInfoSchema] })
  likesCount: Array<likeInfo>;
  @Prop({ default: [], type: [likeInfoSchema] })
  dislikesCount: Array<likeInfo>;
  @Prop({ default: 'NaN', required: true })
  myStatus: string;
  @Prop({ default: [], type: [likeInfoSchema] })
  newestLikes: Array<likeInfo>;
}
export const extendedLikesInfoSchema =
  SchemaFactory.createForClass(extendedLikesInfo);

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

  @Prop({ default: {}, type: extendedLikesInfoSchema })
  public extendedLikesInfo: extendedLikesInfo;

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
    const likeArr = this.extendedLikesInfo.likesCount.filter(
      (m) => m?.userId === userId,
    ).length;
    const dislikeArr = this.extendedLikesInfo.dislikesCount.filter(
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

    const result = {
      id: this._id.toString(),
      title: this.title,
      shortDescription: this.shortDescription,
      content: this.content,
      blogId: this.blogId,
      blogName: this.blogName,
      createdAt: this.createdAt,
      extendedLikesInfo: {
        likesCount: this.extendedLikesInfo.likesCount.length,
        dislikesCount: this.extendedLikesInfo.dislikesCount.length,
        myStatus: status,
        newestLikes: this.extendedLikesInfo.likesCount.splice(-3).reverse(),
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
  createBlog: (inputModel: CreatePostBlogDto | CreatePostDto) => PostsDocument;
};
export type PostsModelMethodsType = {
  updateInfo: (inputModel: UpdatePostDto, blogName: string) => Post;
  getViewModel: (userId: string) => ViewPostDto;
};

export type PostsModelType = Model<PostsDocument> &
  PostsModelStaticType &
  PostsModelMethodsType;
