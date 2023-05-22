import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }): string => value.trim())
  @Length(20, 300)
  content: string;
}
