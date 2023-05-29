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

import { ViewCommentDto } from '../../../public/dto/comment/view-comment.dto';
import { ViewPostDto } from '../../../public/dto/post/view-post.dto';
import { SAViewUserDto } from '../../../sa/dto/user/sa-view-user.dto';
import { createApp } from '../../../helpers/createApp';
import { PaginatorCommentWithWithPostInfoViewModel } from '../../../pagination/paginatorType';
import { ViewBlogDto } from '../../dto/blog/view-blog.dto';
import { AppModule } from '../../../app.module';

describe.skip('comment-blogger-tests-pack', () => {
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
      }
      for (let i = 0; i < 2; i++) {
        const commentInput = createCommentInput();
        const CommentResponse = await agent
          .post(info.posts + posts[i].id + info.comments)
          .auth(accessTokens[1], { type: 'bearer' })
          .send(commentInput)
          .expect(201);

        comments.push(CommentResponse.body);
      }
    });

    it('get all comments with post info - 200', async () => {
      const getAllCommentsResponse = await agent
        .get(info.blogger.comments)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);

      expect(getAllCommentsResponse.body)
        .toMatchObject<PaginatorCommentWithWithPostInfoViewModel>;

      expect(getAllCommentsResponse.body.items[0].id).toBe(comments[1].id);
      expect(getAllCommentsResponse.body.items[0].postInfo.id).toBe(
        posts[1].id,
      );
      expect(getAllCommentsResponse.body.items[1].id).toBe(comments[0].id);
      expect(getAllCommentsResponse.body.items[1].postInfo.id).toBe(
        posts[0].id,
      );
    });
  });
});
