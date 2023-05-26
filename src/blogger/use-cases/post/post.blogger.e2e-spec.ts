import {
  info,
  createUserInput,
  createBlogInput,
  createPostInput,
} from '../../../../test/functionTest';
import supertest from 'supertest';

import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { ViewPostDto } from '../../../public/dto/post/view-post.dto';
import { SAViewUserDto } from '../../../sa/dto/user/sa-view-user.dto';
import { createApp } from '../../../helpers/createApp';
import { ViewBlogDto } from '../../dto/blog/view-blog.dto';
import { AppModule } from '../../../app.module';

describe.skip('post-blogger-tests-pack', () => {
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

  describe('create.post.blogger', () => {
    const users: Array<SAViewUserDto> = [];
    const accessTokens: Array<string> = [];
    const blogs: Array<ViewBlogDto> = [];

    beforeAll(async () => {
      await agent.delete(info.testingDelete);
      for (let i = 0; i < 2; i++) {
        const userInput = createUserInput();
        const userResponse = await agent
          .post(info.sa.user)
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
      }
    });

    it('create post - 201', async () => {
      const postInput = createPostInput();
      const createPostResponse = await agent
        .post(info.blogger.blogs + blogs[0].id + info.posts)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(postInput)
        .expect(201);

      expect(createPostResponse.body).toMatchObject<ViewPostDto>;
      expect(createPostResponse.body.content).toBe(postInput.content);
      expect(createPostResponse.body.title).toBe(postInput.title);
      expect(createPostResponse.body.shortDescription).toBe(
        postInput.shortDescription,
      );
      expect(createPostResponse.body.blogId).toBe(blogs[0].id);
      expect(createPostResponse.body.blogName).toBe(blogs[0].name);
    });

    it('create post - 400 - title error', async () => {
      const postInput = { ...createPostInput(), title: faker.random.alpha(31) };
      const createPostResponse = await agent
        .post(info.blogger.blogs + blogs[0].id + info.posts)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(postInput)
        .expect(400);
    });

    it('create post - 400 - shortDescription error', async () => {
      const postInput = {
        ...createPostInput(),
        shortDescription: faker.random.alpha(101),
      };
      const createPostResponse = await agent
        .post(info.blogger.blogs + blogs[0].id + info.posts)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(postInput)
        .expect(400);
    });

    it('create post - 400 - content error', async () => {
      const postInput = {
        ...createPostInput(),
        content: faker.random.alpha(1001),
      };
      const createPostResponse = await agent
        .post(info.blogger.blogs + blogs[0].id + info.posts)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(postInput)
        .expect(400);
    });

    it('create post - 401 - unauthorized', async () => {
      const postInput = createPostInput();
      const createPostResponse = await agent
        .post(info.blogger.blogs + blogs[0].id + info.posts)
        .send(postInput)
        .expect(401);
    });

    it('create post - 403 - forbidden', async () => {
      const postInput = createPostInput();
      const createPostResponse = await agent
        .post(info.blogger.blogs + blogs[0].id + info.posts)
        .auth(accessTokens[1], { type: 'bearer' })
        .send(postInput)
        .expect(403);
    });

    it('create post - 404 - not found', async () => {
      const postInput = createPostInput();
      const createPostResponse = await agent
        .post(info.blogger.blogs + faker.random.numeric(6) + info.posts)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(postInput)
        .expect(404);
    });
  });
});
