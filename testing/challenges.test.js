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