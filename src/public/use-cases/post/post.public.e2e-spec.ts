import {
  info,
  createUserInput,
  createBlogInput,
  createPostInput,
  createCommentInput,
} from '../../../../test/functionTest';
import supertest from 'supertest';

import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { ViewBlogDto } from '../../../blogger/dto/blog/view-blog.dto';
import { SAViewUserDto } from '../../../sa/dto/user/sa-view-user.dto';
import { User } from '../../../entities/user.entity';
import { createApp } from '../../../helpers/createApp';
import { PaginatorCommentWithWithPostInfoViewModel } from '../../../pagination/paginatorType';
import { ViewCommentDto } from '../../dto/comment/view-comment.dto';
import { LikeDto } from '../../dto/likes/like.dto';
import { ViewPostDto } from '../../dto/post/view-post.dto';
import { AppModule } from '../../../app.module';

describe.skip('post-public-tests-pack', () => {
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

  describe('getPostsByBlogId.public', () => {
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

    it('get posts by blog - 200', async () => {
      const postsResponse = await agent
        .get(info.blogs + blogs[0].id + info.posts)
        .expect(200);

      expect(postsResponse.body.items[0].title).toBe(posts[0].title);
      expect(postsResponse.body.items[0].shortDescription).toBe(
        posts[0].shortDescription,
      );
      expect(postsResponse.body.items[0].content).toBe(posts[0].content);
    });
  });
  describe('getPosts.public', () => {
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

    it('get posts - 200', async () => {
      const postsResponse = await agent.get(info.posts).expect(200);

      expect(postsResponse.body.items[0].title).toBe(posts[0].title);
      expect(postsResponse.body.items[0].shortDescription).toBe(
        posts[0].shortDescription,
      );
      expect(postsResponse.body.items[0].content).toBe(posts[0].content);
    });
  });

  describe('getPostById.public', () => {
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

    it('get posts by blog - 200', async () => {
      const postResponse = await agent
        .get(info.posts + posts[0].id)
        .expect(200);

      expect(postResponse.body.title).toBe(posts[0].title);
      expect(postResponse.body.shortDescription).toBe(
        posts[0].shortDescription,
      );
      expect(postResponse.body.content).toBe(posts[0].content);
    });
    it('get posts by blog - 404 - error', async () => {
      const postResponse = await agent
        .get(info.posts + faker.lorem.word)
        .expect(404);
    });
  });

  describe('likePost.public', () => {
    const blogs: Array<ViewBlogDto> = [];
    const posts: Array<ViewPostDto> = [];
    const accessTokens: Array<string> = [];
    let likeStatus: LikeDto;
    let postInput;
    beforeAll(async () => {
      await agent.delete(info.testingDelete);
      const userInput = createUserInput();
      const userResponse = await agent
        .post(info.sa.users)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .send(userInput)
        .expect(201);

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

    it('like post - 204', async () => {
      likeStatus = { likeStatus: 'Like' };

      const likeResponse = await agent
        .put(info.posts + posts[0].id + info.like)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(likeStatus)
        .expect(204);

      const postResponse = await agent
        .get(info.posts + posts[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);

      expect(postResponse.body.extendedLikesInfo.likesCount).toBe(1);
      expect(postResponse.body.extendedLikesInfo.myStatus).toBe('Like');
    });
    it('dislike post - 204', async () => {
      likeStatus = { likeStatus: 'Dislike' };

      const likeResponse = await agent
        .put(info.posts + posts[0].id + info.like)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(likeStatus)
        .expect(204);

      const postResponse = await agent
        .get(info.posts + posts[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);

      expect(postResponse.body.extendedLikesInfo.likesCount).toBe(0);

      expect(postResponse.body.extendedLikesInfo.dislikesCount).toBe(1);
      expect(postResponse.body.extendedLikesInfo.myStatus).toBe('Dislike');
    });
    it('dislike post - 400', async () => {
      const likeStatus2 = { likeStatus: 66 };

      const likeResponse = await agent
        .put(info.posts + posts[0].id + info.like)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(likeStatus2)
        .expect(400);
    });

    it('dislike post - 401', async () => {
      likeStatus = { likeStatus: 'Dislike' };

      const likeResponse = await agent
        .put(info.posts + posts[0].id + info.like)
        .send(likeStatus)
        .expect(401);
    });
    it('dislike post - 404', async () => {
      likeStatus = { likeStatus: 'Dislike' };
      const likeResponse = await agent
        .put(info.posts + faker.lorem.word + info.like)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(likeStatus)
        .expect(404);
    });
  });
});
