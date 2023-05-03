import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PaginationQuery } from 'src/pagination/base-pagination';
import { Blog } from './entities/blog.entity';
import { ViewBlogDto } from './dto/view-blog.dto';
import { PaginatorBlog, PaginatorPost } from 'src/pagination/paginatorType';
import { BlogRepository } from './blog.repository';
import { PostRepository } from 'src/post/post.repository';
import { CreatePostBlogDto } from './dto/create-post-in-blog.dto';
import { Post } from 'src/post/entities/post.entity';
import { ViewPostDto } from 'src/post/dto/view-post.dto';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly postRepository: PostRepository,
  ) {}
  async getBlogById(id: string) {
    const blog = await this.blogRepository.findBlogById(id);
    if (!blog) {
      throw new NotFoundException();
    }
    return blog.getViewModel();
  }
  async getBlogs(query: PaginationQuery) {
    const filterName: { name: { $regex: string } } = query.createFilterName();

    const filterSort: { [x: string]: number } = query.sortFilter();

    const totalCount = await this.blogRepository.findCountBlogs(filterName);

    const pagesCount = query.countPages(totalCount);

    const blogsFromDB: Blog[] = await this.blogRepository.findBlogs({
      find: filterName,
      sort: filterSort,
      skip: query.skip(),
      limit: query.pageSize,
    });

    const blogs: ViewBlogDto[] = blogsFromDB.map((m) => m.getViewModel());

    const result: PaginatorBlog = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: blogs,
    };

    return result;
  }
  async createBlog(inputModel: CreateBlogDto) {
    const blog: Blog = Blog.createBlog(inputModel);
    const result = await this.blogRepository.save(blog);
    return result.getViewModel();
  }
  async updateBlog(id: string, inputModel: UpdateBlogDto) {
    const blog: Blog | null = await this.blogRepository.findBlogById(id);
    if (!blog) {
      throw new NotFoundException();
    }
    const blogUpdated = blog.updateInfo(inputModel);
    return this.blogRepository.save(blogUpdated);
  }
  async deleteBlog(id: string) {
    const blog = await this.blogRepository.findBlogById(id);
    if (!blog) {
      throw new NotFoundException();
    }
    return await this.blogRepository.delete(id);
  }

  //Create ang get post throw blog
  async createPostByBlogId(blogId: string, inputModel: CreatePostBlogDto) {
    const blog: Blog | null = await this.blogRepository.findBlogById(blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    const post: Post = Post.createPost(blog.name, inputModel, blogId);
    const result = await this.postRepository.save(post);
    //user
    const userId = '';
    return result.getViewModel(userId);
  }

  async findPostByBlogId(blogId: string, query: PaginationQuery) {
    const blog: Blog | null = await this.blogRepository.findBlogById(blogId);
    if (!blog) {
      throw new NotFoundException();
    }

    const filter: { blogId: string } = { blogId: blogId };

    const filterSort: { [x: string]: number } = query.sortFilter();

    const totalCount = await this.postRepository.findCountPosts(filter);

    const pagesCount = query.countPages(totalCount);

    const postsFromDB: Post[] = await this.postRepository.findPosts({
      find: filter,
      sort: filterSort,
      skip: query.skip(),
      limit: query.pageSize,
    });
    //User
    const userId = '';

    const posts: ViewPostDto[] = postsFromDB.map((m) => m.getViewModel(userId));

    const result: PaginatorPost = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: posts,
    };

    return result;
  }
}
