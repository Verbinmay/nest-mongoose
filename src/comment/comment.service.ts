import { Injectable, NotFoundException } from '@nestjs/common';

import { UserRepository } from '../user/user.repository';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async findById(id: string, userId: string) {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException();
    }
    return comment.getViewModel(userId);
  }

  async updateComment(a: { commentId: string; content: string }) {
    return await this.commentRepository.updateComment(a);
  }

  async deleteComment(commentId: string) {
    return await this.commentRepository.deleteComment(commentId);
  }

  async updateCommentLikeStatus(a: {
    comment: any;
    likeStatus: 'None' | 'Like' | 'Dislike';
    userId: string;
  }) {
    const user = await this.userRepository.findUserById(a.userId);

    if (!user) {
      return false;
    }

    const index = a.comment.likesInfo.findIndex((m) => m.userId === a.userId);

    if (a.likeStatus === 'None' && a.comment.likesInfo.length > 0) {
      if (index > -1) {
        a.comment.likesInfo.splice(index, 1);
      }
    } else if (a.likeStatus === 'Like' || a.likeStatus === 'Dislike') {
      if (index > -1) {
        a.comment.likesInfo[index].status = a.likeStatus;
        a.comment.likesInfo[index].addedAt = new Date().toISOString();
      } else {
        a.comment.likesInfo.push({
          addedAt: new Date().toISOString(),
          userId: a.userId,
          login: user.login,
          status: a.likeStatus,
        });
      }
    }

    try {
      await this.commentRepository.save(a.comment);
      return true;
    } catch (error) {
      return false;
    }
  }
}
