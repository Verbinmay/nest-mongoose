import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Post, PostsModelType as PostModelType } from './entities/post.entity';

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

  async findPosts(a: { find: object; sort: any; skip: number; limit: number }) {
    const result: Array<Post> = await this.PostModel.find(a.find)
      .sort(a.sort)
      .skip(a.skip)
      .limit(a.limit);

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
}
