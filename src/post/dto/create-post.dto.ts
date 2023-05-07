import { IsNotEmpty, IsString, Validate } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

import { CreatePostBlogDto } from '../../blog/dto/create-post-in-blog.dto';
import { ValidationBlogId } from '../../validation/validationId';

export class CreatePostDto extends PartialType(CreatePostBlogDto) {
  @IsNotEmpty()
  @IsString()
  @Validate(ValidationBlogId)
  blogId: string;
}
