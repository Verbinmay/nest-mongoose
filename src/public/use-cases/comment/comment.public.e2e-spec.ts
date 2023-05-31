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

  describe('getCommentsByPostId.public', () => {
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
});
