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
    commentId: string;
    likeStatus: string;
    userId: string;
  }) {
    const user = await this.userRepository.findUserById(a.userId);
    if (!user) {
      return false;
    }
    const likeInfo = {
      addedAt: new Date().toISOString(),
      userId: a.userId,
      login: user.login,
    };

    return await this.commentRepository.updateCommentLikeStatus({
      commentId: a.commentId,
      likeStatus: a.likeStatus,
      likeInfo: likeInfo,
    });
  }
}
