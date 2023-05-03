import { ViewBlogDto } from 'src/blog/dto/view-blog.dto';
import { ViewPostDto } from 'src/post/dto/view-post.dto';

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
  items: Array<UserViewModel>;
};

export type PaginatorCommentViewModel = PaginatorEnd & {
  items: Array<CommentViewModel>;
};

export type PaginatorCommentWithLikeViewModel = PaginatorEnd & {
  items: Array<CommentWithLikeViewModel>;
};
