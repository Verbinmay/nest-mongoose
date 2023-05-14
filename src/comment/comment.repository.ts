import {
  Comment,
  CommentsModelType as CommentsModelType,
} from './entities/comment.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { like } from '../likes/entities/like.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentsModelType,
  ) {}
  async findById(id: string) {
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
}
