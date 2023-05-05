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

  async updatePostLikeStatus(a: {
    postId: string;
    likeStatus: string;
    likeInfo: any;
  }) {
    try {
      const result = await this.PostModel.findById(a.postId);

      if (!result) return false;

      let likeArr = 0;
      let dislikeArr = 0;

      switch (a.likeStatus) {
        case 'None':
          likeArr = result.extendedLikesInfo.likesCount.findIndex(
            (b) => b.userId === a.likeInfo.userId,
          );

          if (likeArr > -1) {
            result.extendedLikesInfo.likesCount.splice(likeArr, 1);
          }

          dislikeArr = result.extendedLikesInfo.dislikesCount.findIndex(
            (b) => b.userId === a.likeInfo.userId,
          );

          if (dislikeArr > -1) {
            result.extendedLikesInfo.dislikesCount.splice(dislikeArr, 1);
          }

          break;
        case 'Like':
          dislikeArr = result.extendedLikesInfo.dislikesCount.findIndex(
            (b) => b.userId === a.likeInfo.userId,
          );

          if (dislikeArr > -1) {
            result.extendedLikesInfo.dislikesCount.splice(dislikeArr, 1);
          }
          likeArr = result.extendedLikesInfo.likesCount.findIndex(
            (b) => b.userId === a.likeInfo.userId,
          );

          if (likeArr <= -1) {
            result.extendedLikesInfo.likesCount.push(a.likeInfo);
          }

          break;
        case 'Dislike':
          likeArr = result.extendedLikesInfo.likesCount.findIndex(
            (b) => b.userId === a.likeInfo.userId,
          );

          if (likeArr > -1) {
            result.extendedLikesInfo.likesCount.splice(likeArr, 1);
          }

          dislikeArr = result.extendedLikesInfo.dislikesCount.findIndex(
            (b) => b.userId === a.likeInfo.userId,
          );

          if (dislikeArr <= -1) {
            result.extendedLikesInfo.dislikesCount.push(a.likeInfo);
          }
          break;
      }

      result.save();

      return true;
    } catch (error) {
      return false;
    }
  }
}
