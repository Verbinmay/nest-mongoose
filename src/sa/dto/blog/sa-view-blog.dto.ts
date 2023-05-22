import { ViewBlogDto } from '../../../blogger/dto/blog/view-blog.dto';

export class SAViewBlogDto extends ViewBlogDto {
  blogOwnerInfo: {
    userId: string;
    userLogin: string;
  };
}
