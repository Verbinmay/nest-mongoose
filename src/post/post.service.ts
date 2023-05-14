import {
  PaginatorCommentWithLikeViewModel,
  PaginatorPost,
} from '../pagination/paginatorType';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Blog } from '../blog/entities/blog.entity';
import { ViewCommentDto } from '../comment/dto/view-comment.dto';
import { Comment } from '../comment/entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { BlogRepository } from '../blog/blog.repository';
import { CommentRepository } from '../comment/comment.repository';
import { PaginationQuery } from '../pagination/base-pagination';
import { UserRepository } from '../user/user.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ViewPostDto } from './dto/view-post.dto';
import { Post } from './entities/post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async updatePostLikeStatus(a: {
    post: any;
    likeStatus: 'None' | 'Like' | 'Dislike';
    userId: string;
  }) {
    const user = await this.userRepository.findUserById(a.userId);

    if (!user) {
      return false;
    }
    const index = a.post.likesInfo.findIndex((m) => m.userId === a.userId);

    if (a.likeStatus === 'None' && a.post.likesInfo.length > 0) {
      if (index > -1) {
        a.post.likesInfo.splice(index, 1);
      }
    } else if (a.likeStatus === 'Like' || a.likeStatus === 'Dislike') {
      if (index > -1) {
        a.post.likesInfo[index].status = a.likeStatus;
        a.post.likesInfo[index].addedAt = new Date().toISOString();
      } else {
        a.post.likesInfo.push({
          addedAt: new Date().toISOString(),
          userId: a.userId,
          login: user.login,
          status: a.likeStatus,
        });
      }
    }

    try {
      await this.postRepository.save(a.post);
      return true;
    } catch (error) {
      return false;
    }
  }

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

  async getPosts(query: PaginationQuery, userId: string) {
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

  async getPostById(id: string, userId: string) {
    const post = await this.postRepository.findPostById(id);
    if (!post) {
      throw new NotFoundException();
    }
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

  async getCommentsByPostId(postId: string, query: any, userId: string) {
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

    const comments: ViewCommentDto[] = commentsFromDb.map((m) =>
      m.getViewModel(userId),
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

  async createCommentByPostId(a: {
    content: string;
    userId: string;
    postId: string;
  }) {
    const user: User | null = await this.userRepository.findUserById(a.userId);
    if (!user) {
      throw new NotFoundException();
    }
    const comment = Comment.createComment({
      content: a.content,
      userId: user._id.toString(),
      userLogin: user.login,
      postId: a.postId,
    });
    const result = await this.commentRepository.save(comment);
    return result.getViewModel(user._id.toString());
  }
}
