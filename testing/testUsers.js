const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const request = require("supertest");
const app = require("../app");

async function createAndLoginUser(userData) {
  // Clean up if user already exists
  await prisma.users.deleteMany({ where: { email: userData.email } });

  const registerRes = await request(app).post("/auth/register").send(userData);
  if (registerRes.statusCode !== 201 && registerRes.statusCode !== 200) {
    throw new Error(`Failed to register test user: ${userData.username}`);
  }

  const loginRes = await request(app).post("/auth/login").send({
    username: userData.username,
    password: userData.password
  });

  if (loginRes.statusCode !== 200) {
    throw new Error(`Failed to log in test user: ${userData.username}`);
  }

  return {
    token: loginRes.body.token,
    user: loginRes.body.safeUser
  };
}

async function setupTestUser() {
  return await createAndLoginUser({
    username: "seeduser",
    first_name: "Seed",
    last_name: "User",
    email: "seeduser@example.com",
    password: "password",
    imageUrl: null
  });
}

async function setupTestUser2() {
  return await createAndLoginUser({
    username: "seeduser2",
    first_name: "Seed",
    last_name: "User2",
    email: "seeduser2@example.com",
    password: "password",
    imageUrl: null
  });
}

async function setupTestUser3() {
  return await createAndLoginUser({
    username: "seeduser3",
    first_name: "Seed",
    last_name: "User3",
    email: "seeduser3@example.com",
    password: "password",
    imageUrl: null
  });
}

async function setupTestUser4() {
  return await createAndLoginUser({
    username: "seeduser4",
    first_name: "Seed",
    last_name: "User4",
    email: "seeduser4@example.com",
    password: "password",
    imageUrl: null
  });
}

module.exports = {
  setupTestUser,
  setupTestUser2,
  setupTestUser3,
  setupTestUser4
};
