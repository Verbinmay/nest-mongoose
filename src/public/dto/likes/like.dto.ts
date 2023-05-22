import { IsEnum } from 'class-validator';

export class LikeDto {
  @IsEnum(['None', 'Like', 'Dislike'])
  likeStatus: 'None' | 'Like' | 'Dislike';
}
