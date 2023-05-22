import mongoose, { HydratedDocument, Model, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CreateBlogDto } from '../blogger/blogs/dto/create-blog.dto';
import { UpdateBlogDto } from '../blogger/blogs/dto/update-blog.dto';
import { ViewBlogDto } from '../blogger/blogs/dto/view-blog.dto';
import { SAViewBlogDto } from '../sa/dto/sa-view-blog.dto';

@Schema()
export class Blog {
  constructor(userId: string, userLogin: string, inputModel: CreateBlogDto) {
    this.name = inputModel.name;
    this.description = inputModel.description;
    this.websiteUrl = inputModel.websiteUrl;
    this.userId = userId;
    this.userLogin = userLogin;
  }
  @Prop({ default: new Types.ObjectId(), type: mongoose.Schema.Types.ObjectId })
  public _id: Types.ObjectId = new Types.ObjectId();

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true })
  public description: string;

  @Prop({ required: true })
  public websiteUrl: string;

  @Prop({ required: true })
  public userId: string;

  @Prop({ required: true })
  public userLogin: string;

  @Prop({ default: new Date().toISOString() })
  public createdAt: string = new Date().toISOString();

  @Prop({ default: new Date().toISOString() })
  public updatedAt: string = new Date().toISOString();

  @Prop({ type: Boolean, default: false })
  public isMembership = false;

  updateInfo(inputModel: UpdateBlogDto) {
    this.name = inputModel.name;
    this.description = inputModel.description;
    this.websiteUrl = inputModel.websiteUrl;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  getViewModel(): ViewBlogDto {
    const result = {
      id: this._id.toString(),
      name: this.name,
      description: this.description,
      websiteUrl: this.websiteUrl,
      createdAt: this.createdAt,
      isMembership: this.isMembership,
    };
    return result;
  }

  SAgetViewModel(): SAViewBlogDto {
    const result = {
      id: this._id.toString(),
      name: this.name,
      description: this.description,
      websiteUrl: this.websiteUrl,
      createdAt: this.createdAt,
      isMembership: this.isMembership,
      blogOwnerInfo: {
        userId: this.userId,
        userLogin: this.userLogin,
      },
    };
    return result;
  }

  // static createBlog(inputModel: CreateBlogDto): Blog {
  //   const blog = new Blog(inputModel);
  //   blog.name = inputModel.name;
  //   blog.description = inputModel.description;
  //   blog.websiteUrl = inputModel.websiteUrl;
  //   return blog;
  // }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.methods = {
  updateInfo: Blog.prototype.updateInfo,
  getViewModel: Blog.prototype.getViewModel,
  SAgetViewModel: Blog.prototype.SAgetViewModel,
};

// BlogSchema.statics = {
//   createBlog: Blog.createBlog,
// };

export type BlogsDocument = HydratedDocument<Blog>;

export type BlogsModelStaticType = {
  createBlog: (inputModel: CreateBlogDto) => BlogsDocument;
};
export type BlogsModelMethodsType = {
  updateInfo: (inputModel: UpdateBlogDto) => Blog;
  getViewModel: () => ViewBlogDto;
  SAgetViewModel: () => SAViewBlogDto;
};

export type BlogsModelType = Model<BlogsDocument> &
  BlogsModelStaticType &
  BlogsModelMethodsType;
