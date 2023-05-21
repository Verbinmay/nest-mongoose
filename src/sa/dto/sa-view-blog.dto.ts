import { ViewBlogDto } from '../../blogger/blogs/dto/view-blog.dto';

export class SAViewBlogDto extends ViewBlogDto {
  blogOwnerInfo: {
    userId: string;
    userLogin: string;
  };
}
