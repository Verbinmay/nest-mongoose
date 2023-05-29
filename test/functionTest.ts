import supertest from 'supertest';

import { faker } from '@faker-js/faker';

import { ViewBlogDto } from '../src/blogger/dto/blog/view-blog.dto';

export const info = {
  blogs: '/blogs/',
  posts: '/posts/',
  ban: '/ban/',
  comments: '/comments/',
  testingDelete: '/testing/all-data',
  test: { user: '/testing/user/' },
  auth: {
    resendingConfirmation: '/auth/registration-email-resending',
    registration: '/auth/registration',
    login: '/auth/login',
    registrationConfirmation: '/auth/registration-confirmation',
    passwordRecovery: '/auth/password-recovery',
    newPassword: '/auth/new-password',
  },
  blogger: {
    blogs: '/blogger/blogs/',
    users: '/blogger/users/',
    usersBlog: '/blogger/users/blog/',
    comments: '/blogger/blogs/comments',
  },
  sa: {
    saLogin: 'admin',
    saPassword: 'qwerty',
    users: '/sa/users',
  },
};
// url: {
// blogs: '/blogs/',
// posts: '/posts/',
// comments: '/comments/',
// like: '/like-status/',
// users: '/users/',
// auth: {
// login: '/auth/login',
// logout: '/auth/logout',
// refreshToken: '/auth/refresh-token',
// me: '/auth/me',
// registration: '/auth/registration',
// registrationConfirmation: '/auth/registration-confirmation',
// emailResending: '/auth/registration-email-resending',
//   },
//   security: '/security/devices/',
//   testingDelete: '/testing/all-data',
// },

//BLOG
export function createBlogInput() {
  return {
    name: faker.word.noun(6),
    description: faker.lorem.sentence(6),
    websiteUrl: faker.internet.url(),
  };
}

// export async function testCreateBlogs(
//   agent: supertest.SuperAgentTest,
//   number: number,
// ) {
//   const blogs: any = [];
//   for (let i = 0; i < number; i++) {
//     const createdBlog = {
//       name: faker.word.noun(6),
//       description: faker.lorem.sentence(6),
//       websiteUrl: faker.internet.url(),
//     };

//     const result = await agent
//       .post(info.url.blogs)
//       .set('Authorization', info.headers.authorization)
//       .send(createdBlog)
//       .expect(201);
//     blogs.push(result.body);
//   }

//   return blogs;
// }

//POST
export function createPostInput() {
  return {
    title: faker.word.noun(6),
    shortDescription: faker.lorem.sentence(5),
    content: faker.lorem.sentences(5),
  };
}

// export async function testCreatePosts(
//   agent: supertest.SuperAgentTest,
//   number: number,
//   blog: ViewBlogDto,
// ) {
//   const posts: any = [];
//   for (let i = 0; i < number; i++) {
//     const createdPost = {
//       title: faker.word.noun(6),
//       shortDescription: faker.lorem.sentence(5),
//       content: faker.lorem.sentences(5),
//       blogId: blog.id,
//     };

//     const result = await agent
//       .post(info.url.posts)
//       .set('Authorization', info.headers.authorization)
//       .send(createdPost)
//       .expect(201);
//     posts.push(result.body);
//   }

//   return posts;
// }

//USERS

export function createUserInput() {
  return {
    login: faker.word.noun(6),
    password: faker.word.noun(8),
    email: faker.internet.email(),
  };
}

// export async function testCreateUsers(
//   agent: supertest.SuperAgentTest,
//   number: number,
// ) {
//   const users: any = [];
//   for (let i = 0; i < number; i++) {
//     const createdPost = createUserInput();

//     const result = await agent
//       .post(info.url.users)
//       .set('Authorization', info.headers.authorization)
//       .send(createdPost)
//       .expect(201);
//     if (result.body) {
//       users.push(result.body);
//     }
//   }

//   return users;
// }

// //COMMENTS

export function createCommentInput() {
  return {
    content: faker.lorem.sentences(4),
  };
}

// export async function testCreateComments(a: {
//   number: number;
//   post: PostViewModel;
// }) {
//   const comments: any = [];
//   for (let i = 0; i < a.number; i++) {
//     const inputInfoUser = testInputInfoUser();
//     const inputInfoComment = testInputInfoComments();

//     const user = await agent
//       .post(info.url.users)
//       .set('Authorization', info.headers.authorization)
//       .send(inputInfoUser)
//       .expect(201);

//     const login = await agent
//       .post(info.url.auth.login)
//       .send({
//         loginOrEmail: inputInfoUser.email,
//         password: inputInfoUser.password,
//       })
//       .expect(200);

//     const comment = await agent
//       .post(info.url.posts + a.post.id + info.url.comments)
//       .send({ ...inputInfoComment, postId: a.post.id })
//       .set('Authorization', 'Bearer ' + login.body.accessToken)
//       .expect(201);

//     comments.push(comment.body);
//   }

//   return comments;
// }

// //
