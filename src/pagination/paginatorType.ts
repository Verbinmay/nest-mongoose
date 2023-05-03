import { ViewBlogDto } from 'src/blog/dto/view-blog.dto';
import { ViewCommentDto } from 'src/comment/dto/view-comment.dto';
import { ViewPostDto } from 'src/post/dto/view-post.dto';
import { ViewUserDto } from 'src/user/dto/view-user.dto';

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
