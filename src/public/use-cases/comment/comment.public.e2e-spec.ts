import {
  info,
  createUserInput,
  createBlogInput,
  createPostInput,
  createCommentInput,
} from '../../../../test/functionTest';
import {
  PaginatorCommentWithLikeViewModel,
  PaginatorCommentWithWithPostInfoViewModel,
} from '../../../pagination/paginatorType';
import supertest from 'supertest';

import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { ViewBlogDto } from '../../../blogger/dto/blog/view-blog.dto';
import { SAViewUserDto } from '../../../sa/dto/user/sa-view-user.dto';
import { User } from '../../../entities/user.entity';
import { createApp } from '../../../helpers/createApp';
import { ViewCommentDto } from '../../dto/comment/view-comment.dto';
import { LikeDto } from '../../dto/likes/like.dto';
import { ViewPostDto } from '../../dto/post/view-post.dto';
import { AppModule } from '../../../app.module';

describe('post-public-tests-pack', () => {
  jest.setTimeout(1000 * 1000);
  let app: INestApplication;
  let fullApp: INestApplication;
  let agent: supertest.SuperAgentTest;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    //преобразование апп
    fullApp = createApp(app);
    await fullApp.init();
    agent = supertest.agent(fullApp.getHttpServer());
  });

  afterAll(async () => {
    await fullApp.close();
  });

  describe.skip('createComment.public', () => {
    const users: Array<SAViewUserDto> = [];
    const blogs: Array<ViewBlogDto> = [];
    const posts: Array<ViewPostDto> = [];
    const accessTokens: Array<string> = [];
    let postInput;
    beforeAll(async () => {
      await agent.delete(info.testingDelete);
      const userInput = createUserInput();
      const userResponse = await agent
        .post(info.sa.users)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .send(userInput)
        .expect(201);

      users.push(userResponse.body);

      const loginInput = {
        loginOrEmail: userInput.login,
        password: userInput.password,
      };
      const loginResponse = await agent
        .post(info.auth.login)
        .send(loginInput)
        .expect(200);

      accessTokens.push(loginResponse.body.accessToken);

      const blogInput = createBlogInput();
      const blogResponse = await agent
        .post(info.blogger.blogs)
        .auth(loginResponse.body.accessToken, { type: 'bearer' })
        .send(blogInput)
        .expect(201);

      blogs.push(blogResponse.body);

      postInput = createPostInput();
      const postResponse = await agent
        .post(info.blogger.blogs + blogs[0].id + info.posts)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(postInput)
        .expect(201);

      posts.push(postResponse.body);
    });

    it('create comment - 201', async () => {
      const commentInput = createCommentInput();
      const commentResponse = await agent
        .post(info.posts + posts[0].id + info.comments)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(commentInput)
        .expect(201);

      expect(commentResponse.body).toMatchObject<ViewCommentDto>;

      expect(commentResponse.body.commentatorInfo.userLogin).toBe(
        users[0].login,
      );
    });
  });

  describe.skip('getCommentsByPostId.public', () => {
    const users: Array<SAViewUserDto> = [];
    const blogs: Array<ViewBlogDto> = [];
    const posts: Array<ViewPostDto> = [];
    const comments: Array<ViewCommentDto> = [];
    const accessTokens: Array<string> = [];
    let postInput;
    beforeAll(async () => {
      await agent.delete(info.testingDelete);
      const userInput = createUserInput();
      const userResponse = await agent
        .post(info.sa.users)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .send(userInput)
        .expect(201);

      users.push(userResponse.body);

      const loginInput = {
        loginOrEmail: userInput.login,
        password: userInput.password,
      };
      const loginResponse = await agent
        .post(info.auth.login)
        .send(loginInput)
        .expect(200);

      accessTokens.push(loginResponse.body.accessToken);

      const blogInput = createBlogInput();
      const blogResponse = await agent
        .post(info.blogger.blogs)
        .auth(loginResponse.body.accessToken, { type: 'bearer' })
        .send(blogInput)
        .expect(201);

      blogs.push(blogResponse.body);

      postInput = createPostInput();
      const postResponse = await agent
        .post(info.blogger.blogs + blogs[0].id + info.posts)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(postInput)
        .expect(201);

      posts.push(postResponse.body);

      for (let i = 0; i < 2; i++) {
        const commentInput = createCommentInput();
        const commentResponse = await agent
          .post(info.posts + posts[0].id + info.comments)
          .auth(accessTokens[0], { type: 'bearer' })
          .send(commentInput)
          .expect(201);

        comments.push(commentResponse.body);
      }
    });

    it('get comments - 200', async () => {
      const commentInput = createCommentInput();
      const commentsResponse = await agent
        .get(info.posts + posts[0].id + info.comments)
        .expect(200);

      expect(commentsResponse.body)
        .toMatchObject<PaginatorCommentWithLikeViewModel>;

      expect(commentsResponse.body.items[0]).toEqual(comments[1]);
    });
    it('get comments - 404 - posts error', async () => {
      const commentInput = createCommentInput();
      const commentsResponse = await agent
        .get(info.posts + faker.lorem.word + info.comments)
        .expect(404);
    });
  });

  describe.skip('getCommentById.public', () => {
    const users: Array<SAViewUserDto> = [];
    const blogs: Array<ViewBlogDto> = [];
    const posts: Array<ViewPostDto> = [];
    const comments: Array<ViewCommentDto> = [];
    const accessTokens: Array<string> = [];
    let postInput;
    beforeAll(async () => {
      await agent.delete(info.testingDelete);
      const userInput = createUserInput();
      const userResponse = await agent
        .post(info.sa.users)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .send(userInput)
        .expect(201);

      users.push(userResponse.body);

      const loginInput = {
        loginOrEmail: userInput.login,
        password: userInput.password,
      };
      const loginResponse = await agent
        .post(info.auth.login)
        .send(loginInput)
        .expect(200);

      accessTokens.push(loginResponse.body.accessToken);

      const blogInput = createBlogInput();
      const blogResponse = await agent
        .post(info.blogger.blogs)
        .auth(loginResponse.body.accessToken, { type: 'bearer' })
        .send(blogInput)
        .expect(201);

      blogs.push(blogResponse.body);

      postInput = createPostInput();
      const postResponse = await agent
        .post(info.blogger.blogs + blogs[0].id + info.posts)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(postInput)
        .expect(201);

      posts.push(postResponse.body);

      for (let i = 0; i < 2; i++) {
        const commentInput = createCommentInput();
        const commentResponse = await agent
          .post(info.posts + posts[0].id + info.comments)
          .auth(accessTokens[0], { type: 'bearer' })
          .send(commentInput)
          .expect(201);

        comments.push(commentResponse.body);
      }
    });

    it('get comment - 200', async () => {
      const commentInput = createCommentInput();
      const commentsResponse = await agent
        .get(info.comments + comments[0].id)
        .expect(200);

      expect(commentsResponse.body).toMatchObject<ViewCommentDto>;

      expect(commentsResponse.body).toEqual(comments[0]);
    });
    it('get comments - 404 - posts error', async () => {
      const commentInput = createCommentInput();
      const commentResponse = await agent
        .get(info.comments + faker.lorem.word)
        .expect(404);
    });
  });

  describe.skip('likeComment.public', () => {
    const users: Array<SAViewUserDto> = [];
    const blogs: Array<ViewBlogDto> = [];
    const posts: Array<ViewPostDto> = [];
    const comments: Array<ViewCommentDto> = [];
    const accessTokens: Array<string> = [];
    let postInput;
    let likeStatus: LikeDto;
    beforeAll(async () => {
      await agent.delete(info.testingDelete);
      const userInput = createUserInput();
      const userResponse = await agent
        .post(info.sa.users)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .send(userInput)
        .expect(201);

      users.push(userResponse.body);

      const loginInput = {
        loginOrEmail: userInput.login,
        password: userInput.password,
      };
      const loginResponse = await agent
        .post(info.auth.login)
        .send(loginInput)
        .expect(200);

      accessTokens.push(loginResponse.body.accessToken);

      const blogInput = createBlogInput();
      const blogResponse = await agent
        .post(info.blogger.blogs)
        .auth(loginResponse.body.accessToken, { type: 'bearer' })
        .send(blogInput)
        .expect(201);

      blogs.push(blogResponse.body);

      postInput = createPostInput();
      const postResponse = await agent
        .post(info.blogger.blogs + blogs[0].id + info.posts)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(postInput)
        .expect(201);

      posts.push(postResponse.body);

      for (let i = 0; i < 2; i++) {
        const commentInput = createCommentInput();
        const commentResponse = await agent
          .post(info.posts + posts[0].id + info.comments)
          .auth(accessTokens[0], { type: 'bearer' })
          .send(commentInput)
          .expect(201);

        comments.push(commentResponse.body);
      }
    });

    it('like comment - 200', async () => {
      likeStatus = { likeStatus: 'Like' };
      const likeResponse = await agent
        .put(info.comments + comments[0].id + info.like)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(likeStatus)
        .expect(204);

      const commentResponse = await agent
        .get(info.comments + comments[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);

      expect(commentResponse.body.likesInfo.likesCount).toBe(1);
      expect(commentResponse.body.likesInfo.myStatus).toBe('Like');
    });

    it('like comment - 200', async () => {
      likeStatus = { likeStatus: 'Dislike' };
      const likeResponse = await agent
        .put(info.comments + comments[0].id + info.like)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(likeStatus)
        .expect(204);

      const commentResponse = await agent
        .get(info.comments + comments[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);

      expect(commentResponse.body.likesInfo.likesCount).toBe(0);
      expect(commentResponse.body.likesInfo.dislikesCount).toBe(1);
      expect(commentResponse.body.likesInfo.myStatus).toBe('Dislike');
    });
    it('dislike post - 400- input error', async () => {
      const likeStatus2 = { likeStatus: 66 };

      const likeResponse = await agent
        .put(info.comments + comments[0].id + info.like)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(likeStatus2)
        .expect(400);
    });

    it('like comment - 401 - error', async () => {
      likeStatus = { likeStatus: 'Like' };
      const likeResponse = await agent
        .put(info.comments + comments[0].id + info.like)
        .send(likeStatus)
        .expect(401);
    });

    it('dislike post - 404 - error', async () => {
      likeStatus = { likeStatus: 'Like' };

      const likeResponse = await agent
        .put(info.comments + faker.lorem.word + info.like)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(likeStatus)
        .expect(404);
    });
  });
  describe.skip('updateCommentById.public', () => {
    const users: Array<SAViewUserDto> = [];
    const blogs: Array<ViewBlogDto> = [];
    const posts: Array<ViewPostDto> = [];
    const comments: Array<ViewCommentDto> = [];
    const accessTokens: Array<string> = [];
    let postInput;
    beforeAll(async () => {
      await agent.delete(info.testingDelete);
      for (let i = 0; i < 2; i++) {
        const userInput = createUserInput();
        const userResponse = await agent
          .post(info.sa.users)
          .auth(info.sa.saLogin, info.sa.saPassword)
          .send(userInput)
          .expect(201);

        users.push(userResponse.body);

        const loginInput = {
          loginOrEmail: userInput.login,
          password: userInput.password,
        };
        const loginResponse = await agent
          .post(info.auth.login)
          .send(loginInput)
          .expect(200);

        accessTokens.push(loginResponse.body.accessToken);
      }

      const blogInput = createBlogInput();
      const blogResponse = await agent
        .post(info.blogger.blogs)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(blogInput)
        .expect(201);

      blogs.push(blogResponse.body);

      postInput = createPostInput();
      const postResponse = await agent
        .post(info.blogger.blogs + blogs[0].id + info.posts)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(postInput)
        .expect(201);

      posts.push(postResponse.body);

      const commentInput = createCommentInput();
      const commentResponse = await agent
        .post(info.posts + posts[0].id + info.comments)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(commentInput)
        .expect(201);

      comments.push(commentResponse.body);
    });

    //TODO тест спешит
    it('update comment - 204 ', async () => {
      const commentInput = createCommentInput();
      const updateCommentResponse = await agent
        .put(info.comments + comments[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(commentInput)
        .expect(204);

      setTimeout(() => {
        console.log('Delayed function executed');
      }, 40000 * 1000);

      const commentResponse = await agent
        .get(info.comments + comments[0].id)
        .expect(200);

      expect(commentResponse.body.content).toBe(commentInput.content);
    });
    //TODO not working
    // it('update comment - 400 - error ', async () => {
    //   const commentInput = { content: 22 };
    //   const updateCommentResponse = await agent
    //     .put(info.comments + comments[0].id)
    //     .auth(accessTokens[0], { type: 'bearer' })
    //     .send(commentInput)
    //     .expect(400);
    // });

    it('update comment - 401 - error ', async () => {
      const commentInput = createCommentInput();
      const updateCommentResponse = await agent
        .put(info.comments + comments[0].id)
        .send(commentInput)
        .expect(401);
    });

    it('update comment - 403 - error ', async () => {
      const commentInput = createCommentInput();
      const updateCommentResponse = await agent
        .put(info.comments + comments[0].id)
        .auth(accessTokens[1], { type: 'bearer' })
        .send(commentInput)
        .expect(403);
    });

    it('update comment - 404 - error ', async () => {
      const commentInput = createCommentInput();
      const updateCommentResponse = await agent
        .put(info.comments + faker.lorem.word)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(commentInput)
        .expect(404);
    });
  });
  describe('deleteCommentById.public', () => {
    const users: Array<SAViewUserDto> = [];
    const blogs: Array<ViewBlogDto> = [];
    const posts: Array<ViewPostDto> = [];
    const comments: Array<ViewCommentDto> = [];
    const accessTokens: Array<string> = [];
    let postInput;
    beforeAll(async () => {
      await agent.delete(info.testingDelete);
      for (let i = 0; i < 2; i++) {
        const userInput = createUserInput();
        const userResponse = await agent
          .post(info.sa.users)
          .auth(info.sa.saLogin, info.sa.saPassword)
          .send(userInput)
          .expect(201);

        users.push(userResponse.body);

        const loginInput = {
          loginOrEmail: userInput.login,
          password: userInput.password,
        };
        const loginResponse = await agent
          .post(info.auth.login)
          .send(loginInput)
          .expect(200);

        accessTokens.push(loginResponse.body.accessToken);
      }

      const blogInput = createBlogInput();
      const blogResponse = await agent
        .post(info.blogger.blogs)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(blogInput)
        .expect(201);

      blogs.push(blogResponse.body);

      postInput = createPostInput();
      const postResponse = await agent
        .post(info.blogger.blogs + blogs[0].id + info.posts)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(postInput)
        .expect(201);

      posts.push(postResponse.body);

      const commentInput = createCommentInput();
      const commentResponse = await agent
        .post(info.posts + posts[0].id + info.comments)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(commentInput)
        .expect(201);

      comments.push(commentResponse.body);
    });

    //TODO not working
    // it('update comment - 400 - error ', async () => {
    //   const commentInput = { content: 22 };
    //   const updateCommentResponse = await agent
    //     .put(info.comments + comments[0].id)
    //     .auth(accessTokens[0], { type: 'bearer' })
    //     .send(commentInput)
    //     .expect(400);
    // });

    it('delete comment - 401 - error ', async () => {
      const deleteCommentResponse = await agent
        .delete(info.comments + comments[0].id)
        .expect(401);
    });

    it('delete comment - 403 - error ', async () => {
      const deleteCommentResponse = await agent
        .delete(info.comments + comments[0].id)
        .auth(accessTokens[1], { type: 'bearer' })
        .expect(403);
    });

    it('delete comment - 404 - error ', async () => {
      const deleteCommentResponse = await agent
        .delete(info.comments + faker.lorem.word)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(404);
    });

    //TODO тест спешит
    it('update comment - 204 ', async () => {
      const deleteCommentResponse = await agent
        .delete(info.comments + comments[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(204);

      const commentResponse = await agent
        .get(info.comments + comments[0].id)
        .expect(404);
    });
  });
});
