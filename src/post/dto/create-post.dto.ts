import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Validate } from 'class-validator';

import { CreatePostBlogDto } from '../../blog/dto/create-post-in-blog.dto';
import { ValidationBlogId } from '../../validation/validationId';

export class CreatePostDto extends CreatePostBlogDto {
  @IsNotEmpty()
  @IsString()
  @Validate(ValidationBlogId)
  @Transform(({ value }): string => value.trim())
  blogId: string;
}
