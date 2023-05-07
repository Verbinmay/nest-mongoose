import { ViewBlogDto } from '../blog/dto/view-blog.dto';
import { ViewCommentDto } from '../comment/dto/view-comment.dto';
import { ViewPostDto } from '../post/dto/view-post.dto';
import { ViewUserDto } from '../user/dto/view-user.dto';

export type PaginatorEnd = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
};

export type PaginatorBlog = PaginatorEnd & {
  items: Array<ViewBlogDto>;
};

export type PaginatorPost = PaginatorEnd & {
  items: Array<ViewPostDto>;
};

export type PaginatorUser = PaginatorEnd & {
  items: Array<ViewUserDto>;
};

export type PaginatorCommentWithLikeViewModel = PaginatorEnd & {
  items: Array<ViewCommentDto>;
};
