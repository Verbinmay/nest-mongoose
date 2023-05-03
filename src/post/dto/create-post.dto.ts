import { PartialType } from '@nestjs/mapped-types';
import { CreatePostBlogDto } from 'src/blog/dto/create-post-in-blog.dto';

export class CreatePostDto extends PartialType(CreatePostBlogDto) {
  blogId: string;
}
