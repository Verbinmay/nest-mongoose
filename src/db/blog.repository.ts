import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Blog, BlogsModelType } from '../entities/blog.entity';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogsModelType,
  ) {}

  async findBlogById(id: string): Promise<Blog> {
    try {
      return await this.BlogModel.findById(id);
    } catch (error) {
      return null;
    }
  }

  async save(blog: Blog) {
    const blogModel = new this.BlogModel(blog);
    return await blogModel.save();
  }

  async delete(id: string) {
    try {
      return await this.BlogModel.findByIdAndDelete(id);
    } catch (error) {
      return null;
    }
  }
  async findCountBlogs(filter: any) {
    return await this.BlogModel.countDocuments(filter);
  }

  async findBlogs(a: {
    find: { name: { $regex: string } } | object;
    sort: any;
    skip: number;
    limit: number;
  }) {
    const result: Array<Blog> = await this.BlogModel.find(a.find)
      .sort(a.sort)
      .skip(a.skip)
      .limit(a.limit);

    return result;
  }
}
