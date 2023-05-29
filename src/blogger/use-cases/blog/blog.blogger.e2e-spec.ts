import {
  info,
  createUserInput,
  createBlogInput,
} from '../../../../test/functionTest';
import supertest from 'supertest';

import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { SAViewUserDto } from '../../../sa/dto/user/sa-view-user.dto';
import { createApp } from '../../../helpers/createApp';
import { ViewBlogDto } from '../../dto/blog/view-blog.dto';
import { AppModule } from '../../../app.module';

describe.skip('blog-blogger-tests-pack', () => {
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

  describe('create.blog.blogger', () => {
    let accessToken;
    beforeAll(async () => {
      await agent.delete(info.testingDelete);
      const userInput = createUserInput();
      const user = await agent
        .post(info.sa.users)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .send(userInput)
        .expect(201);
      const loginInput = {
        loginOrEmail: userInput.login,
        password: userInput.password,
      };
      const login = await agent
        .post(info.auth.login)
        .send(loginInput)
        .expect(200);

      accessToken = login.body.accessToken;
    });

    it('create blog - 201', async () => {
      const blogInput = createBlogInput();
      const blog = await agent
        .post(info.blogger.blogs)
        .auth(accessToken, { type: 'bearer' })
        .send(blogInput)
        .expect(201);

      expect(blog.body).toMatchObject<ViewBlogDto>;
      expect(blog.body.name).toBe(blogInput.name);
      expect(blog.body.description).toBe(blogInput.description);
      expect(blog.body.websiteUrl).toBe(blogInput.websiteUrl);
    });

    it('create blog - 400 - name error', async () => {
      const blogInput = { ...createBlogInput(), name: faker.random.alpha(16) };
      const result = await agent
        .post(info.blogger.blogs)
        .auth(accessToken, { type: 'bearer' })
        .send(blogInput)
        .expect(400);

      expect(result.body).toEqual({
        errorsMessages: expect.any(Array),
      });
    });

    it('create blog - 400 -  description error', async () => {
      const blogInput = {
        ...createBlogInput(),
        description: faker.random.alpha(501),
      };
      const result = await agent
        .post(info.blogger.blogs)
        .auth(accessToken, { type: 'bearer' })
        .send(blogInput)
        .expect(400);

      expect(result.body).toEqual({
        errorsMessages: expect.any(Array),
      });
    });

    it('create blog - 400 -  websiteUrl error', async () => {
      let blogInput = {
        ...createBlogInput(),
        websiteUrl: faker.random.alpha(15),
      };

      let blog = await agent
        .post(info.blogger.blogs)
        .auth(accessToken, { type: 'bearer' })
        .send(blogInput)
        .expect(400);

      expect(blog.body).toEqual({
        errorsMessages: expect.any(Array),
      });

      blogInput = {
        ...createBlogInput(),
        websiteUrl: faker.internet.url() + '/' + faker.random.alpha(100),
      };
      blog = await agent
        .post(info.blogger.blogs)
        .auth(accessToken, { type: 'bearer' })
        .send(blogInput)
        .expect(400);
      expect(blog.body).toEqual({
        errorsMessages: expect.any(Array),
      });
    });
  });

  describe('delete.blog.blogger', () => {
    const users: Array<SAViewUserDto> = [];
    const accessTokens: Array<string> = [];
    const blogs: Array<ViewBlogDto> = [];

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

        const blogInput = createBlogInput();
        const blogResponse = await agent
          .post(info.blogger.blogs)
          .auth(loginResponse.body.accessToken, { type: 'bearer' })
          .send(blogInput)
          .expect(201);

        blogs.push(blogResponse.body);
      }
    });

    it('delete blog - 401 - access error', async () => {
      const deleteBlog = await agent
        .delete(info.blogger.blogs + blogs[0].id)
        .expect(401);
    });

    it('delete blog - 404 - not found error', async () => {
      const deleteBlog = await agent
        .delete(info.blogger.blogs + faker.random.numeric(6))
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(404);
    });

    it('delete blog - 403 - forbidden', async () => {
      const deleteBlog = await agent
        .delete(info.blogger.blogs + blogs[1].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(403);
    });

    it('delete blog - 204', async () => {
      const deleteBlog = await agent
        .delete(info.blogger.blogs + blogs[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(204);

      const getBlog = await agent.get(info.blogs + blogs[0].id).expect(404);
    });
  });

  describe('get.blogs.blogger', () => {
    const users: Array<SAViewUserDto> = [];
    const accessTokens: Array<string> = [];
    const blogs: Array<ViewBlogDto> = [];

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

        for (let i = 0; i < 2; i++) {
          const blogInput = createBlogInput();
          const blogResponse = await agent
            .post(info.blogger.blogs)
            .auth(loginResponse.body.accessToken, { type: 'bearer' })
            .send(blogInput)
            .expect(201);

          blogs.push(blogResponse.body);
        }
      }
    });

    it('get blogs - 200', async () => {
      const blogsResponse = await agent
        .get(info.blogger.blogs)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);

      expect(blogsResponse.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [blogs[1], blogs[0]],
      });
    });

    it('get blogs - 200', async () => {
      const blogsResponse = await agent
        .get(
          info.blogger.blogs +
            '?sortBy=createdAt&sortDirection=asc&pageNumber=1&pageSize=12',
        )
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);

      expect(blogsResponse.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 12,
        totalCount: 2,
        items: [blogs[0], blogs[1]],
      });
    });

    it('get blogs - 401 - Unauthorized', async () => {
      const blogsResponse = await agent
        .get(
          info.blogger.blogs +
            '?sortBy=createdAt&sortDirection=asc&pageNumber=1&pageSize=12',
        )
        .expect(401);
    });
  });

  describe('update.blog.blogger', () => {
    const users: Array<SAViewUserDto> = [];
    const accessTokens: Array<string> = [];
    const blogs: Array<ViewBlogDto> = [];

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

        const blogInput = createBlogInput();
        const blogResponse = await agent
          .post(info.blogger.blogs)
          .auth(loginResponse.body.accessToken, { type: 'bearer' })
          .send(blogInput)
          .expect(201);

        blogs.push(blogResponse.body);
      }
    });

    it('update blog - 204', async () => {
      const blogInput = createBlogInput();
      const updateBlogResponse = await agent
        .put(info.blogger.blogs + blogs[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(blogInput)
        .expect(204);

      const getBlogResponse = await agent
        .get(info.blogs + blogs[0].id)
        .expect(200);

      expect(getBlogResponse.body.id).toBe(blogs[0].id);
      expect(getBlogResponse.body.description).toBe(blogInput.description);
      expect(getBlogResponse.body.name).toBe(blogInput.name);
      expect(getBlogResponse.body.websiteUrl).toBe(blogInput.websiteUrl);
    });

    it('update blog - 400 - name error', async () => {
      const blogInput = { ...createBlogInput(), name: faker.random.alpha(16) };
      const updateBlogResponse = await agent
        .put(info.blogger.blogs + blogs[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(blogInput)
        .expect(400);
    });
    it('update blog - 400 - description error', async () => {
      const blogInput = {
        ...createBlogInput(),
        description: faker.random.alpha(501),
      };
      const updateBlogResponse = await agent
        .put(info.blogger.blogs + blogs[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(blogInput)
        .expect(400);
    });
    it('update blog - 400 - websiteUrl error', async () => {
      const blogInput = {
        ...createBlogInput(),
        websiteUrl: faker.internet.url() + faker.random.alpha(100),
      };
      const updateBlogResponse = await agent
        .put(info.blogger.blogs + blogs[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .send(blogInput)
        .expect(400);
    });
    it('update blog - 401', async () => {
      const blogInput = createBlogInput();
      const updateBlogResponse = await agent
        .put(info.blogger.blogs + blogs[0].id)
        .send(blogInput)
        .expect(401);
    });
    it('update blog - 403', async () => {
      const blogInput = createBlogInput();
      const updateBlogResponse = await agent
        .put(info.blogger.blogs + blogs[0].id)
        .auth(accessTokens[1], { type: 'bearer' })
        .send(blogInput)
        .expect(403);
    });
    it('update blog - 404', async () => {
      const blogInput = createBlogInput();
      const updateBlogResponse = await agent
        .put(info.blogger.blogs + faker.random.numeric(6))
        .auth(accessTokens[0], { type: 'bearer' })
        .send(blogInput)
        .expect(404);
    });
  });
});
