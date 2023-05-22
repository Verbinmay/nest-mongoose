import { ViewBlogDto } from '../blogger/blogs/dto/view-blog.dto';
import { ViewCommentDto } from '../comment/dto/view-comment.dto';
import { ViewPostDto } from '../post/dto/view-post.dto';
import { SAViewBlogDto } from '../sa/dto/sa-view-blog.dto';
import { SAViewUserDto } from '../sa/dto/sa-view-user.dto';

export type PaginatorEnd = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
};

export type PaginatorBlog = PaginatorEnd & {
  items: Array<ViewBlogDto> | Array<SAViewBlogDto>;
};

export type PaginatorPost = PaginatorEnd & {
  items: Array<ViewPostDto>;
};

export type PaginatorUser = PaginatorEnd & {
  items: Array<SAViewUserDto>;
};

export type PaginatorCommentWithLikeViewModel = PaginatorEnd & {
  items: Array<ViewCommentDto>;
};
