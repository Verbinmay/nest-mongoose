import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Post, PostsModelType as PostModelType } from '../entities/post.entity';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  async save(post: Post) {
    const postModel = new this.PostModel(post);
    return postModel.save();
  }

  async findCountPosts(filter: object) {
    return await this.PostModel.countDocuments(filter);
  }

  async findPostsWithPagination(a: {
    find: object;
    sort: any;
    skip: number;
    limit: number;
  }) {
    const result: Array<Post> = await this.PostModel.find(a.find)
      .sort(a.sort)
      .skip(a.skip)
      .limit(a.limit);

    return result;
  }
  async findPostsByUserId(filter) {
    const result: Array<Post> = await this.PostModel.find(filter);
    return result;
  }
  async findPostById(id: string): Promise<Post> {
    try {
      return await this.PostModel.findById(id);
    } catch (error) {
      return null;
    }
  }

  async delete(id: string) {
    try {
      return await this.PostModel.findByIdAndDelete(id);
    } catch (error) {
      return null;
    }
  }

  async banPostByUserId(userId: string, isBanned: boolean) {
    try {
      await this.PostModel.updateMany(
        { userId: userId },
        { $set: { isBaned: isBanned } },
      );
      await this.PostModel.updateMany(
        {},
        { $set: { 'extendedLikesInfo.$[elem].isBaned': isBanned } },
        { arrayFilters: [{ 'elem.userId': userId }] },
      );

      return true;
    } catch (error) {
      return null;
    }
  }
  async banPostByBlogId(blogId: string, isBanned: boolean) {
    try {
      await this.PostModel.updateMany(
        { blogId: blogId },
        { $set: { isBaned: isBanned } },
      );
      return true;
    } catch (error) {
      return null;
    }
  }
}
