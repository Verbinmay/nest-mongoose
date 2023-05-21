import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostBlogDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @Transform(({ value }): string => value.trim())
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }): string => value.trim())
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }): string => value.trim())
  content: string;
}
