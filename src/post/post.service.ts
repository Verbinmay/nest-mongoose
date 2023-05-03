import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { BlogRepository } from 'src/blog/blog.repository';
import { Blog } from 'src/blog/entities/blog.entity';
import { Post } from './entities/post.entity';
import { PaginationQuery } from 'src/pagination/base-pagination';
import { ViewPostDto } from './dto/view-post.dto';
import { PaginatorPost } from 'src/pagination/paginatorType';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async createPost(inputModel: CreatePostDto) {
    const blog: Blog | null = await this.blogRepository.findBlogById(
      inputModel.blogId,
    );
    if (!blog) {
      throw new NotFoundException();
    }
    const post: Post = Post.createPost(blog.name, inputModel);
    const result = await this.postRepository.save(post);
    //user
    const userId = '';
    return result.getViewModel(userId);
  }

  async getPosts(query: PaginationQuery) {
    const filter: object = {};

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

  async getPostById(id: string) {
    const post = await this.postRepository.findPostById(id);
    if (!post) {
      throw new NotFoundException();
    }
    const userId = '';
    return post.getViewModel(userId);
  }

  async updatePost(id: string, inputModel: UpdatePostDto) {
    const post: Post | null = await this.postRepository.findPostById(id);
    if (!post) {
      throw new NotFoundException();
    }
    const blog = await this.blogRepository.findBlogById(inputModel.blogId);
    if (!blog) {
      throw new NotFoundException();
    }

    const postUpdated = post.updateInfo(inputModel, blog.name);
    return this.postRepository.save(postUpdated);
  }

  async deletePost(id: string) {
    const post = await this.postRepository.findPostById(id);
    if (!post) {
      throw new NotFoundException();
    }
    return await this.postRepository.delete(id);
  }

  async getCommentsByPostId(postId, query) {
    const filter: { postId: string } = { postId: postId };

    const filterSort: any = query.sortFilter();

    const totalCount = await this.commentRepository.findCountComments(filter);

    const pagesCount = query.countPages(totalCount);

    const commentsFromDb: Comment[] =
      await this.commentRepository.getCommentsByPostId({
        find: filter,
        sort: filterSort,
        skip: query.skip(),
        limit: query.pageSize,
      });

    const comments: CommentWithLikeViewModel[] = commentsFromDb.map((m) =>
      m.getViewModel(),
    );

    const result: PaginatorCommentWithLikeViewModel = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: comments,
    };

    return result;
  }
}
