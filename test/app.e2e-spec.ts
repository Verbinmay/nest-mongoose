import {
  info,
  testCreateBlogs,
  testCreatePosts,
  testCreateUsers,
  testInputInfoBlog,
  testInputInfoPost,
  testInputInfoUser,
} from './functionTest';
import * as supertest from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { BlogRepository } from '../src/db/blog.repository';
import { createApp } from '../src/helpers/createApp';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
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

  describe('BLOGS Create', () => {
    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
    });

    it('POST|201-created blog', async () => {
      const number = 1;
      const blogs = await testCreateBlogs(agent, number);
      expect(blogs).toHaveLength(number);
    });
  });

  describe('BLOGS Get All Blogs', () => {
    const number = 2;

    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
    });

    it('GET|200- empty pagination`s blogs array', async () => {
      const paginatorBlogs = await agent.get(info.url.blogs).expect(200);

      expect(paginatorBlogs.body.items).toEqual([]);
    });

    it('POST|201-created blog', async () => {
      const blogs = await testCreateBlogs(agent, number);
      expect(blogs).toHaveLength(2);
      expect.setState({ blogs });
    });

    it('GET|200 -pagination`s array with one ', async () => {
      const { blogs } = expect.getState();
      const result = await agent
        .get(
          info.url.blogs +
            '?searchNameTerm=' +
            blogs[0].name +
            '&sortBy=createdAt&sortDirection=desc&pageNumber=1&pageSize=10',
        )
        .expect(200);

      expect(result.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [blogs[0]],
      });
    });
  });

  describe.skip('BLOGS Get By Id', () => {
    const numberOfBlogs = 2;
    // let blogs: Array<BlogViewModel>;

    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
      const blogs = await testCreateBlogs(agent, numberOfBlogs);
      expect(blogs).toHaveLength(numberOfBlogs);
      expect.setState({ blogs });
    });

    it('GET|200 - FIND BY ID', async () => {
      const { blogs } = expect.getState();

      const result = await agent
        .get(info.url.blogs + blogs[0].id)
        .expect(200, blogs[0]);
      expect(result.body).toEqual(blogs[0]);
    });
  });

  describe.skip('BLOGS Update', () => {
    const number = 2;
    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
      const blogs = await testCreateBlogs(agent, number);
      const blogInputInfo = testInputInfoBlog();
      expect.setState({ blogs });
      expect.setState({ blogInputInfo });
    });

    it('PUT| 204 - UPDATE BLOG BY ID', async () => {
      const { blogs } = expect.getState();
      const { blogInputInfo } = expect.getState();

      await agent
        .put(info.url.blogs + blogs[0].id)
        .set('Authorization', info.headers.authorization)
        .send(blogInputInfo)
        .expect(204);

      const findUpdateBlog = await agent
        .get(info.url.blogs + blogs[0].id)
        .expect(200);

      expect(blogInputInfo.name).toBe(findUpdateBlog.body.name);
      expect(blogInputInfo.description).toBe(findUpdateBlog.body.description);
      expect(blogInputInfo.websiteUrl).toBe(findUpdateBlog.body.websiteUrl);
    });
  });

  describe.skip('BLOGS Delete', () => {
    const number = 2;

    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
      const blogs = await testCreateBlogs(agent, number);
      expect.setState({ blogs });
    });

    it('PUT| 204 - DELETE BLOG BY ID', async () => {
      const { blogs } = expect.getState();
      await agent.delete(info.url.blogs + blogs[0].id).expect(204);

      await agent.get(info.url.blogs + blogs[0].id).expect(404);
    });
  });

  describe.skip('BLOGS Post and Get Post By Blog Id', () => {
    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
      const blogs = await testCreateBlogs(agent, 1);
      const inputPostByIdInfo = testInputInfoPost();
      expect.setState({ blogs });
      expect.setState({ inputPostByIdInfo });
    }, 8000);

    it(' POST|201 - POST BY BLOG ID', async () => {
      const { blogs } = expect.getState();
      const { inputPostByIdInfo } = expect.getState();

      const post = await agent
        .post(info.url.blogs + blogs[0].id + info.url.posts)
        .set('Authorization', info.headers.authorization)
        .send(inputPostByIdInfo)
        .expect(201);

      expect.setState({ post });

      expect(post.body.title).toEqual(inputPostByIdInfo.title);
      expect(post.body.shortDescription).toEqual(
        inputPostByIdInfo.shortDescription,
      );
      expect(post.body.content).toEqual(inputPostByIdInfo.content);
    });

    it(' GET|200 - pagination array with one post', async () => {
      const { blogs } = expect.getState();
      const { post } = expect.getState();

      const resultPosts = await agent
        .get(info.url.blogs + blogs[0].id + info.url.posts)
        .set('Authorization', info.headers.authorization)
        .expect(200);

      expect(resultPosts.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [post.body],
      });
    });

    it(' GET|404 - pagination blogId error', async () => {
      await agent
        .get(info.url.blogs + faker.random.numeric(6) + info.url.posts)
        .set('Authorization', info.headers.authorization)
        .expect(404);
    });
  });

  describe.skip('POSTS Post Post', () => {
    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
      const blogs = await testCreateBlogs(agent, 1);
      const inputPostByIdInfo = testInputInfoPost();
      expect.setState({ blogs });
      expect.setState({ inputPostByIdInfo });
    }, 8000);

    it(' POST|201 - POST POST', async () => {
      const { blogs } = expect.getState();
      const post = await testCreatePosts(agent, 1, blogs[0]);

      expect(post[0].blogId).toEqual(blogs[0].id);
      expect(post[0].blogName).toEqual(blogs[0].name);

      expect.setState({ post });
    });
  });

  describe.skip('POSTS GET Post', () => {
    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
      const blogs = await testCreateBlogs(agent, 1);
      const post = await testCreatePosts(agent, 1, blogs[0]);

      expect.setState({ blogs });
      expect.setState({ post });
    }, 8000);

    it(' GET|200 - pagination array with one post', async () => {
      const { post } = expect.getState();

      const resultPosts = await agent
        .get(info.url.posts)
        .set('Authorization', info.headers.authorization)
        .expect(200);

      expect(resultPosts.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: post,
      });
    });
  });

  describe.skip('POSTS GET by id Post', () => {
    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
      const blogs = await testCreateBlogs(agent, 1);
      const posts = await testCreatePosts(agent, 1, blogs[0]);

      expect.setState({ blogs });
      expect.setState({ posts });
    }, 8000);

    it(' GET BY ID ', async () => {
      const { posts } = expect.getState();

      const resultPosts = await agent
        .get(info.url.posts + posts[0].id)
        .set('Authorization', info.headers.authorization)
        .expect(200);

      expect(resultPosts.body).toEqual(posts[0]);
    });
  });

  describe.skip('POSTS update Post', () => {
    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
      const blogs = await testCreateBlogs(agent, 1);
      const posts = await testCreatePosts(agent, 1, blogs[0]);
      const inputPostByIdInfo = testInputInfoPost();
      expect.setState({ blogs });
      expect.setState({ posts });
      expect.setState({ inputPostByIdInfo });
    }, 8000);

    it(' PUT|204 - UPDATE POST', async () => {
      const { blogs } = expect.getState();
      const { posts } = expect.getState();
      const { inputPostByIdInfo } = expect.getState();
      await agent
        .put(info.url.posts + posts[0].id)
        .set('Authorization', info.headers.authorization)
        .send({ ...inputPostByIdInfo, blogId: blogs[0].id })
        .expect(204);

      const updatedPost = await agent.get(info.url.posts + posts[0].id);

      expect(updatedPost.body.title).toEqual(inputPostByIdInfo.title);
      expect(updatedPost.body.shortDescription).toEqual(
        inputPostByIdInfo.shortDescription,
      );
      expect(updatedPost.body.content).toEqual(inputPostByIdInfo.content);
      expect(updatedPost.body.blogId).toEqual(blogs[0].id);
      expect(updatedPost.body.blogName).toEqual(blogs[0].name);
    });
  });

  describe.skip('POSTS delete Post', () => {
    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
      const blogs = await testCreateBlogs(agent, 1);
      const posts = await testCreatePosts(agent, 1, blogs[0]);
      expect.setState({ posts });
    }, 8000);

    it(' PUT|204 - delete  POST', async () => {
      const { posts } = expect.getState();
      await agent
        .delete(info.url.posts + posts[0].id)
        .set('Authorization', info.headers.authorization)
        .expect(204);

      await agent.get(info.url.posts + posts[0].id).expect(404);
    });
  });

  describe.skip('USERS create user', () => {
    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
    }, 8000);

    it('GET|201 POST USER', async () => {
      const users = await testCreateUsers(agent, 1);

      expect(users.length).toEqual(1);
    });
  });

  describe.skip('USERS get users', () => {
    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
      const users = await testCreateUsers(agent, 1);
      expect.setState({ users });
    }, 8000);

    it('GET|200 GET USER', async () => {
      const { users } = expect.getState();
      const result = await agent
        .get(info.url.users)
        .set('Authorization', info.headers.authorization)
        .expect(200);

      expect(result.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: users,
      });
    });
  });

  describe.skip('USERS get users', () => {
    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
      const users = await testCreateUsers(agent, 1);
      expect.setState({ users });
    }, 8000);
    it('DELETE|204- DELETE USER', async () => {
      const { users } = expect.getState();

      await agent
        .delete(info.url.users + users[0].id)
        .set('Authorization', info.headers.authorization)
        .expect(204);
    });
  });

  describe('Auth', () => {
    let accessToken: any = {};
    let user: any = {};
    const inputInfoUser = testInputInfoUser();
    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
    }, 8000);

    it('POST|200- POST AUTH', async () => {
      user = await agent
        .post(info.url.users)
        .send(inputInfoUser)
        .set('Authorization', info.headers.authorization)
        .expect(201);

      const auth = await agent
        .post(info.url.auth.login)
        .send({
          loginOrEmail: inputInfoUser.login,
          password: inputInfoUser.password,
        })
        .expect(200);

      accessToken = auth.body.accessToken;
    });

    // it('GET|200 - GET AUTH', async () => {
    //   const authMe = await agent
    //     .get(info.url.auth.me)
    //     .set('Authorization', 'Bearer ' + accessToken)
    //     .expect(200);

    //   expect(authMe.body).toEqual({
    //     email: user.body.email,
    //     login: user.body.login,
    //     userId: user.body.id,
    //   });
    // });
  });
  describe('REGISTRATION CONFIRMATION', () => {
    beforeAll(async () => {
      await agent.delete(info.url.testingDelete);
    }, 8000);
    it('POST|204 POST AUTH REGISTRATION ', async () => {
      const result = await agent
        .post(info.url.auth.registration)
        .send(testInputInfoUser())
        .expect(204);
    });
  });
});
