import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentModelType as CommentModelType,
} from './entities/comment.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
  ) {}
  async findById(id: string): Promise<Comment> {
    try {
      return await this.CommentModel.findById(id);
    } catch (error) {
      return null;
    }
  }

  async findCountComments(filter: { name: { $regex: string } } | object) {
    return await this.CommentModel.countDocuments(filter);
  }
  async getCommentsByPostId(a: {
    find: { name: { $regex: string } } | object;
    sort: any;
    skip: number;
    limit: number;
  }) {
    const result: Array<Comment> = await this.CommentModel.find(a.find)
      .sort(a.sort)
      .skip(a.skip)
      .limit(a.limit);

    return result;
  }

  async save(comment: Comment) {
    const commentModel = new this.CommentModel(comment);
    return commentModel.save();
  }

  async updateComment(a: { commentId: string; content: string }) {
    try {
      const result = await this.CommentModel.findById(a.commentId);

      if (!result) return false;
      result.content = a.content;
      result.save();

      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteComment(commentId: string) {
    try {
      await this.CommentModel.findByIdAndDelete(commentId);
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateCommentLikeStatus(a: {
    commentId: string;
    likeStatus: string;
    likeInfo: any;
  }) {
    try {
      const result = await this.CommentModel.findById(a.commentId);

      if (!result) return false;

      let likeArr = 0;
      let dislikeArr = 0;

      switch (a.likeStatus) {
        case 'None':
          likeArr = result.likesInfo.likesCount.findIndex(
            (b) => b.userId === a.likeInfo.userId,
          );

          if (likeArr > -1) {
            result.likesInfo.likesCount.splice(likeArr, 1);
          }

          dislikeArr = result.likesInfo.dislikesCount.findIndex(
            (b) => b.userId === a.likeInfo.userId,
          );

          if (dislikeArr > -1) {
            result.likesInfo.dislikesCount.splice(dislikeArr, 1);
          }

          break;
        case 'Like':
          dislikeArr = result.likesInfo.dislikesCount.findIndex(
            (b) => b.userId === a.likeInfo.userId,
          );

          if (dislikeArr > -1) {
            result.likesInfo.dislikesCount.splice(dislikeArr, 1);
          }
          likeArr = result.likesInfo.likesCount.findIndex(
            (b) => b.userId === a.likeInfo.userId,
          );

          if (likeArr <= -1) {
            result.likesInfo.likesCount.push(a.likeInfo);
          }

          break;
        case 'Dislike':
          likeArr = result.likesInfo.likesCount.findIndex(
            (b) => b.userId === a.likeInfo.userId,
          );

          if (likeArr > -1) {
            result.likesInfo.likesCount.splice(likeArr, 1);
          }

          dislikeArr = result.likesInfo.dislikesCount.findIndex(
            (b) => b.userId === a.likeInfo.userId,
          );

          if (dislikeArr <= -1) {
            result.likesInfo.dislikesCount.push(a.likeInfo);
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
