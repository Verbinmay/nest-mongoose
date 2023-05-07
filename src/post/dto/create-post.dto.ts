import { PartialType } from '@nestjs/mapped-types';

import { CreatePostBlogDto } from '../../blog/dto/create-post-in-blog.dto';

export class CreatePostDto extends PartialType(CreatePostBlogDto) {
  blogId: string;
}
