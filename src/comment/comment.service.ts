import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

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
}
