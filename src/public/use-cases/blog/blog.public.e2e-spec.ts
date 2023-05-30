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
import { ViewPostDto } from '../../dto/post/view-post.dto';
import { AppModule } from '../../../app.module';

describe.skip('blog-public-tests-pack', () => {
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

  describe('getBlogs.public', () => {
    beforeAll(async () => {
      await agent.delete(info.testingDelete);
    });

    it('get blogs - 200', async () => {
      const blogsResponse = await agent.get(info.blogs).expect(200);

      expect(blogsResponse.body.items.length).toBe(0);
      expect(blogsResponse.body.pagesCount).toBe(0);
      expect(blogsResponse.body.page).toBe(1);
      expect(blogsResponse.body.pageSize).toBe(10);
      expect(blogsResponse.body.totalCount).toBe(0);
    });
  });

  describe('getBlogById.public', () => {
    const userInput = createUserInput();
    const blogs: Array<ViewBlogDto> = [];
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

      const blogInput = createBlogInput();
      const blogResponse = await agent
        .post(info.blogger.blogs)
        .auth(loginResponse.body.accessToken, { type: 'bearer' })
        .send(blogInput)
        .expect(201);

      blogs.push(blogResponse.body);
    });

    it('get blog by id - 200', async () => {
      const blogResponse = await agent
        .get(info.blogs + blogs[0].id)
        .expect(200);

      expect(blogResponse.body.name).toBe(blogs[0].name);
      expect(blogResponse.body.description).toBe(blogs[0].description);
      expect(blogResponse.body.websiteUrl).toBe(blogs[0].websiteUrl);
    });

    it('get blog by id - 404', async () => {
      const blogResponse = await agent
        .get(info.blogs + faker.lorem.word)
        .expect(404);
    });
  });
});
