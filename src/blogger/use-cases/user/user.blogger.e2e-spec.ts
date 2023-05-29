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

import { ViewCommentDto } from '../../../public/dto/comment/view-comment.dto';
import { ViewPostDto } from '../../../public/dto/post/view-post.dto';
import { SAViewUserDto } from '../../../sa/dto/user/sa-view-user.dto';
import { createApp } from '../../../helpers/createApp';
import { PaginatorBannedUsersViewModel } from '../../../pagination/paginatorType';
import { ViewBlogDto } from '../../dto/blog/view-blog.dto';
import { AppModule } from '../../../app.module';

describe.skip('user-blogger-tests-pack', () => {
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

  describe('bun.user.blogger', () => {
    const users: Array<SAViewUserDto> = [];
    const accessTokens: Array<string> = [];
    const blogs: Array<ViewBlogDto> = [];
    const posts: Array<ViewPostDto> = [];
    const comments: Array<ViewCommentDto> = [];

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

      for (let i = 0; i < 2; i++) {
        const blogInput = createBlogInput();
        const blogResponse = await agent
          .post(info.blogger.blogs)
          .auth(accessTokens[0], { type: 'bearer' })
          .send(blogInput)
          .expect(201);

        blogs.push(blogResponse.body);

        const postInput = createPostInput();
        const postResponse = await agent
          .post(info.blogger.blogs + blogResponse.body.id + info.posts)
          .auth(accessTokens[0], { type: 'bearer' })
          .send(postInput)
          .expect(201);

        posts.push(postResponse.body);
      }
    });

    it('ban user - 204', async () => {
      const commentInput = createCommentInput();
      const firstCommentResponse = await agent
        .post(info.posts + posts[0].id + info.comments)
        .auth(accessTokens[1], { type: 'bearer' })
        .send(commentInput)
        .expect(201);

      const bunUserResponse = await agent
        .put(info.blogger.users + users[1].id + info.ban)
        .auth(accessTokens[0], { type: 'bearer' })
        .send({
          isBanned: true,
          banReason: faker.lorem.sentence(6),
          blogId: blogs[0].id,
        })
        .expect(204);

      const CommentResponse = await agent
        .post(info.posts + posts[0].id + info.comments)
        .auth(accessTokens[1], { type: 'bearer' })
        .send(commentInput)
        .expect(403);
    });

    it('unban user - 204', async () => {
      const commentInput = createCommentInput();
      const CommentResponse = await agent
        .post(info.posts + posts[0].id + info.comments)
        .auth(accessTokens[1], { type: 'bearer' })
        .send(commentInput)
        .expect(403);

      const bunUserResponse = await agent
        .put(info.blogger.users + users[1].id + info.ban)
        .auth(accessTokens[0], { type: 'bearer' })
        .send({
          isBanned: false,
          banReason: faker.lorem.sentence(6),
          blogId: blogs[0].id,
        })
        .expect(204);

      const firstCommentResponse = await agent
        .post(info.posts + posts[0].id + info.comments)
        .auth(accessTokens[1], { type: 'bearer' })
        .send(commentInput)
        .expect(201);
    });

    it('bun user - 400 -isBanned error', async () => {
      const bunUserResponse = await agent
        .put(info.blogger.users + users[1].id + info.ban)
        .auth(accessTokens[0], { type: 'bearer' })
        .send({
          isBanned: '',
          banReason: faker.lorem.sentence(6),
          blogId: blogs[0].id,
        })
        .expect(400);
    });
    it('bun user - 400 -banReason error', async () => {
      const bunUserResponse = await agent
        .put(info.blogger.users + users[1].id + info.ban)
        .auth(accessTokens[0], { type: 'bearer' })
        .send({
          isBanned: true,
          banReason: faker.lorem.word({ length: 7 }),
          blogId: blogs[0].id,
        })
        .expect(400);
    });
    it('bun user - 400 - blogId error', async () => {
      const bunUserResponse = await agent
        .put(info.blogger.users + users[1].id + info.ban)
        .auth(accessTokens[0], { type: 'bearer' })
        .send({
          isBanned: true,
          banReason: faker.lorem.sentence(6),
          blogId: faker.lorem.word({ length: 7 }),
        })
        .expect(400);
    });
    it('ban user - 401', async () => {
      const commentInput = createCommentInput();

      const bunUserResponse = await agent
        .put(info.blogger.users + users[1].id + info.ban)
        .send({
          isBanned: true,
          banReason: faker.lorem.sentence(6),
          blogId: blogs[0].id,
        })
        .expect(401);
    });
  });

  describe('get.bannedUser.blogger', () => {
    const users: Array<SAViewUserDto> = [];
    const accessTokens: Array<string> = [];
    const blogs: Array<ViewBlogDto> = [];
    const posts: Array<ViewPostDto> = [];

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

      for (let i = 0; i < 2; i++) {
        const blogInput = createBlogInput();
        const blogResponse = await agent
          .post(info.blogger.blogs)
          .auth(accessTokens[0], { type: 'bearer' })
          .send(blogInput)
          .expect(201);

        blogs.push(blogResponse.body);

        const postInput = createPostInput();
        const postResponse = await agent
          .post(info.blogger.blogs + blogResponse.body.id + info.posts)
          .auth(accessTokens[0], { type: 'bearer' })
          .send(postInput)
          .expect(201);

        posts.push(postResponse.body);
      }
      const banUserResponse = await agent
        .put(info.blogger.users + users[1].id + info.ban)
        .auth(accessTokens[0], { type: 'bearer' })
        .send({
          isBanned: true,
          banReason: faker.lorem.sentence(6),
          blogId: blogs[0].id,
        })
        .expect(204);
    });
    it('get banned user - 200', async () => {
      const getBannedUserResponse = await agent
        .get(info.blogger.usersBlog + blogs[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);

      expect(getBannedUserResponse.body)
        .toMatchObject<PaginatorBannedUsersViewModel>;

      expect(getBannedUserResponse.body.items[0].id).toBe(users[1].id);
    });

    it('get banned user - 401 - unauthorized', async () => {
      const getBannedUserResponse = await agent
        .get(info.blogger.usersBlog + blogs[0].id)

        .expect(401);
    });
  });
});
