// challenges.test.js
const request = require("supertest");
const app = require("../app"); // make sure this path correctly points to your Express app
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
/** POST  register user` */

describe("User sign up and login", function () {

  beforeEach(async () => {
    // Clean up related data
    await prisma.comments.deleteMany();
    await prisma.likes.deleteMany();
    await prisma.challenges.deleteMany();
    await prisma.users.deleteMany({
      where: {
        email: "seeduser@example.com"
      }
    });
  });

  //failling registration/////////////////////////////////////
  test("bad request with missing fields", async function () {
    const resp = await request(app)
        .post("/auth/register")
        .send({
          username: "new",
        });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/auth/register")
        .send({
          username: "new",
          firstName: "first",
          lastName: "last",
          password: "password",
          email: "not-an-email",
        });
    expect(resp.statusCode).toEqual(400);
  });

  // failing Logins/////////////////////////////////////////////
  test("unauth with non-existent user", async function () {
    const resp = await request(app)
        .post("/auth/login")
        .send({
          username: "no-such-user",
          password: "password1",
        });
    expect(resp.statusCode).toEqual(400);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app)
        .post("/auth/login")
        .send({
          username: "u1",
          password: "nope",
        });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/auth/login")
        .send({
          username: "u1",
        });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/auth/login")
        .send({
          username: 42,
          password: "above-is-a-number",
        });
    expect(resp.statusCode).toEqual(400);
  });
  

})