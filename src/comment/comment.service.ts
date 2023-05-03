import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
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
}
