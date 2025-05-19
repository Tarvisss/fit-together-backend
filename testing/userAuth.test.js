
const request = require("supertest")
const app = require("../app");
const {PrismaClient} = require("../generated/prisma")
const prisma = new PrismaClient();
/** POST  register user` */

describe("POST User sign up and login", function () {

  // before all test delete the user form the DB
  beforeAll(async () => {
    await prisma.users.deleteMany({
      where: {
        email: "new@email.com"
      }
    })
  })

  //successful registration
  test("Register User", async function () {
    const resp = await request(app)
        .post("/auth/register")
        .send({
          username: "new",
          first_name: "first",
          last_name: "last",
          password: "password",
          email: "new@email.com",
          imageUrl: null
        });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
          token: expect.any(String),
          safeUser: {
            id: expect.any(Number),
            username: "new",
            first_name: "first",
            last_name: "last",
            email: "new@email.com",
            imageUrl: null
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

  // passing login test////////////////////////////////////////
  test("login User", async function (){
   const resp = await request(app)
     .post("/auth/login")
     .send({
       username: "new",
       password: "password"
     });
     expect(resp.statusCode).toEqual(200)
     expect(resp.body).toEqual({
       token: expect.any(String),
       safeUser: {
         id: expect.any(Number),
         username: "new",
         first_name: "first",
         last_name: "last",
         email: "new@email.com",
         imageUrl: null
       }
     })
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