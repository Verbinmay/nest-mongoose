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

import { SAViewUserDto } from '../../../sa/dto/user/sa-view-user.dto';
import { User } from '../../../entities/user.entity';
import { createApp } from '../../../helpers/createApp';
import { PaginatorCommentWithWithPostInfoViewModel } from '../../../pagination/paginatorType';
import { ViewCommentDto } from '../../dto/comment/view-comment.dto';
import { ViewPostDto } from '../../dto/post/view-post.dto';
import { AppModule } from '../../../app.module';

describe('auth-public-tests-pack', () => {
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

  describe.skip('registration.public', () => {
    beforeAll(async () => {
      await agent.delete(info.testingDelete);
    });

    it('make registration - 204', async () => {
      const userInput = createUserInput();
      const registrationResponse = await agent
        .post(info.auth.registration)
        .send(userInput)
        .expect(204);

      const getUserResponse = await agent
        .get(info.sa.users)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .expect(200);

      const a = getUserResponse.body.items.find(
        (m) => m.login === userInput.login,
      );

      expect(a.email).toBe(userInput.email);
    });

    it('make registration - 400 - login min', async () => {
      const userInput = { ...createUserInput(), login: faker.random.alpha(2) };
      const registrationResponse = await agent
        .post(info.auth.registration)
        .send(userInput)
        .expect(400);
    });

    it('make registration - 400 - login max', async () => {
      const userInput = { ...createUserInput(), login: faker.random.alpha(11) };
      const registrationResponse = await agent
        .post(info.auth.registration)
        .send(userInput)
        .expect(400);
    });

    it('make registration - 400 - password min', async () => {
      const userInput = {
        ...createUserInput(),
        password: faker.random.alpha(5),
      };
      const registrationResponse = await agent
        .post(info.auth.registration)
        .send(userInput)
        .expect(400);
    });

    it('make registration - 400 - password max', async () => {
      const userInput = {
        ...createUserInput(),
        password: faker.random.alpha(21),
      };
      const registrationResponse = await agent
        .post(info.auth.registration)
        .send(userInput)
        .expect(400);
    });

    it('make registration - 400 - email error', async () => {
      const userInput = { ...createUserInput(), email: faker.random.alpha(9) };
      const registrationResponse = await agent
        .post(info.auth.registration)
        .send(userInput)
        .expect(400);
    });
  });

  describe.skip('resendingEmail.public', () => {
    const userInput = createUserInput();
    beforeAll(async () => {
      await agent.delete(info.testingDelete);

      const registrationResponse = await agent
        .post(info.auth.registration)
        .send(userInput)
        .expect(204);
    });

    it('resending email registration - 204', async () => {
      const userResponse = await agent
        .get(info.test.user + userInput.login)
        .expect(200);

      const resendingEmailResponse = await agent
        .post(info.auth.resendingConfirmation)
        .send({ email: userInput.email })
        .expect(204);

      const userWithNewConfirmationResponse = await agent
        .get(info.test.user + userInput.login)
        .expect(200);

      expect(userResponse.body[0].emailConfirmation.confirmationCode).not.toBe(
        userWithNewConfirmationResponse.body[0].emailConfirmation
          .confirmationCode,
      );
    });

    it('resending email registration - 400 - email error', async () => {
      const resendingEmailResponse = await agent
        .post(info.auth.resendingConfirmation)
        .send({ email: faker.random.alpha(9) })
        .expect(400);
    });
  });

  describe.skip('confirmation.public', () => {
    const userInput = createUserInput();
    beforeAll(async () => {
      await agent.delete(info.testingDelete);

      const registrationResponse = await agent
        .post(info.auth.registration)
        .send(userInput)
        .expect(204);
    });

    it('confirmed registration - 204', async () => {
      const userResponse = await agent
        .get(info.test.user + userInput.login)
        .expect(200);

      const confirmationResponse = await agent
        .post(info.auth.registrationConfirmation)
        .send({ code: userResponse.body[0].emailConfirmation.confirmationCode })
        .expect(204);

      const userConfirmedResponse = await agent
        .get(info.test.user + userInput.login)
        .expect(200);

      expect(userConfirmedResponse.body[0].emailConfirmation.isConfirmed).toBe(
        true,
      );
    });
    it('confirmed registration - 400 - code error', async () => {
      const confirmationResponse = await agent
        .post(info.auth.registrationConfirmation)
        .send({ code: faker.word.adjective })
        .expect(400);
    });
  });

  describe.skip('login.public', () => {
    const userInput = createUserInput();
    beforeAll(async () => {
      await agent.delete(info.testingDelete);

      const userResponse = await agent
        .post(info.sa.users)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .send(userInput)
        .expect(201);
    });

    it('login - 204', async () => {
      const loginInput = {
        loginOrEmail: userInput.login,
        password: userInput.password,
      };
      const loginResponse = await agent
        .post(info.auth.login)
        .send(loginInput)
        .expect(200);

      expect(loginResponse.body).toEqual({
        accessToken: expect.any(String),
      });
    });
    // TODO не получилось написать тест
    // it('login - 400 - error', async () => {
    //   const loginInput = {
    //     loginOrEmail: userInput.login,
    //     password: +faker.random.numeric(6),
    //   };
    //   const loginResponse = await agent
    //     .post(info.auth.login)
    //     .send(loginInput)
    //     .expect(400);
    // });

    it('login - 401 - error', async () => {
      const loginInput = {
        loginOrEmail: userInput.login,
        password: faker.definitions.phone_number,
      };
      const loginResponse = await agent
        .post(info.auth.login)
        .send(loginInput)
        .expect(401);
    });
  });

  describe.skip('newPassword-code.public', () => {
    const userInput = createUserInput();
    beforeAll(async () => {
      await agent.delete(info.testingDelete);

      const registrationResponse = await agent
        .post(info.auth.registration)
        .send(userInput)
        .expect(204);
    });

    it('sending code for new password  - 204', async () => {
      const userResponse = await agent
        .get(info.test.user + userInput.login)
        .expect(200);

      const passwordRecoverylResponse = await agent
        .post(info.auth.passwordRecovery)
        .send({ email: userInput.email })
        .expect(204);

      const userWithNewPasswordResponse = await agent
        .get(info.test.user + userInput.login)
        .expect(200);

      expect(userResponse.body[0].emailConfirmation.confirmationCode).not.toBe(
        userWithNewPasswordResponse.body[0].emailConfirmation.confirmationCode,
      );
    });

    it('sending code for new password  - 400 - email error', async () => {
      const resendingEmailResponse = await agent
        .post(info.auth.passwordRecovery)
        .send({ email: faker.random.alpha(9) })
        .expect(400);
    });
  });
  describe('newPassword.public', () => {
    const userInput = createUserInput();
    beforeAll(async () => {
      await agent.delete(info.testingDelete);

      const registrationResponse = await agent
        .post(info.auth.registration)
        .send(userInput)
        .expect(204);

      const passwordRecoveryResponse = await agent
        .post(info.auth.passwordRecovery)
        .send({ email: userInput.email })
        .expect(204);
    });

    it('create new password  - 204', async () => {
      const userResponse = await agent
        .get(info.test.user + userInput.login)
        .expect(200);

      const newPassword = faker.word.noun(8);
      const createNewPasswordResponse = await agent
        .post(info.auth.newPassword)
        .send({
          newPassword: newPassword,
          recoveryCode: userResponse.body[0].emailConfirmation.confirmationCode,
        })
        .expect(204);

      const loginInput = {
        loginOrEmail: userInput.login,
        password: newPassword,
      };
      const loginResponse = await agent
        .post(info.auth.login)
        .send(loginInput)
        .expect(200);
    });

    it('new password  - 400 -  error', async () => {
      const newPasswordResponse = await agent
        .post(info.auth.newPassword)
        .send({
          newPassword: faker.word.noun(7),
          recoveryCode: faker.word.noun(9),
        })
        .expect(400);
    });
  });

  //   describe('create.post.blogger', () => {
  //     const users: Array<SAViewUserDto> = [];
  //     const accessTokens: Array<string> = [];
  //     const blogs: Array<ViewBlogDto> = [];
  //     const posts: Array<ViewPostDto> = [];
  //     const comments: Array<ViewCommentDto> = [];

  //     beforeAll(async () => {
  //       await agent.delete(info.testingDelete);
  //       for (let i = 0; i < 2; i++) {
  //         const userInput = createUserInput();
  //         const userResponse = await agent
  //           .post(info.sa.users)
  //           .auth(info.sa.saLogin, info.sa.saPassword)
  //           .send(userInput)
  //           .expect(201);

  //         users.push(userResponse.body);

  //         const loginInput = {
  //           loginOrEmail: userInput.login,
  //           password: userInput.password,
  //         };
  //         const loginResponse = await agent
  //           .post(info.auth.login)
  //           .send(loginInput)
  //           .expect(200);

  //         accessTokens.push(loginResponse.body.accessToken);

  //         for (let i = 0; i < 2; i++) {
  //           const blogInput = createBlogInput();
  //           const blogResponse = await agent
  //             .post(info.blogger.blogs)
  //             .auth(accessTokens[0], { type: 'bearer' })
  //             .send(blogInput)
  //             .expect(201);

  //           blogs.push(blogResponse.body);

  //           const postInput = createPostInput();
  //           const postResponse = await agent
  //             .post(info.blogger.blogs + blogResponse.body.id + info.posts)
  //             .auth(accessTokens[0], { type: 'bearer' })
  //             .send(postInput)
  //             .expect(201);

  //           posts.push(postResponse.body);
  //         }
  //       }
  //       for (let i = 0; i < 2; i++) {
  //         const commentInput = createCommentInput();
  //         const CommentResponse = await agent
  //           .post(info.posts + posts[i].id + info.comments)
  //           .auth(accessTokens[1], { type: 'bearer' })
  //           .send(commentInput)
  //           .expect(201);

  //         comments.push(CommentResponse.body);
  //       }
  //     });

  //     it('get all comments with post info - 200', async () => {
  //       const getAllCommentsResponse = await agent
  //         .get(info.blogger.comments)
  //         .auth(accessTokens[0], { type: 'bearer' })
  //         .expect(200);

  //       expect(getAllCommentsResponse.body)
  //         .toMatchObject<PaginatorCommentWithWithPostInfoViewModel>;

  //       expect(getAllCommentsResponse.body.items[0].id).toBe(comments[1].id);
  //       expect(getAllCommentsResponse.body.items[0].postInfo.id).toBe(
  //         posts[1].id,
  //       );
  //       expect(getAllCommentsResponse.body.items[1].id).toBe(comments[0].id);
  //       expect(getAllCommentsResponse.body.items[1].postInfo.id).toBe(
  //         posts[0].id,
  //       );
  //     });
  //   });
});
