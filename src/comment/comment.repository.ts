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
}
