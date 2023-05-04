import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';
import { Tokens } from 'src/decorator/tokens.decorator';
import { JWTService } from 'src/jwt/jwt.service';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly jwtService: JWTService,
  ) {}

  @Get()
  async findById(@Param('id') id: string, @Tokens() tokens) {
    const userId = await this.jwtService.getUserIdFromAccessToken(
      tokens.accessToken,
    );
    return this.commentService.findById(id, userId);
  }
}
