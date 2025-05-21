const { setupTestUser3 } = require("./testUsers");
const { pinChallenge, getTestComments} = require("../testing/testHelpers");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

describe("Challenges", () => {
    let token, challengeData, userId;
  
    beforeAll(async () => {
      // Set up test user and get their token and user info
      const { token: userToken, user } = await setupTestUser3();
      token = userToken;
      userId = user.id;
    });
  
    beforeEach(async () => {
      // Clean up database before each test
      await prisma.comments.deleteMany();
      await prisma.likes.deleteMany();
      await prisma.challenges.deleteMany();
  
      // Create a challenge for this user
      challengeData = await prisma.challenges.create({
        data: {
          title: "Loooooooong walk",
          description: "Loooooooooooooooong walk",
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          creator_id: userId,
          created_at: new Date().toISOString()
        }
      });
    });

  test("Pin a challenge", async () => {
    const res = await pinChallenge(token, challengeData.id, userId);

    expect(res.statusCode).toEqual(200);

  });

  test("un-Pin a challenge", async () => {
    const res = await pinChallenge(token, challengeData.id, userId);

    expect(res.statusCode).toEqual(200);
  });
  
  test("Pin a challenge without token", async () => {
    const res = await pinChallenge(challengeData.id, userId);

    expect(res.statusCode).toEqual(403);
  });

  test("un-Pin a challenge without token", async () => {
    const res = await pinChallenge(challengeData.id, userId);

    expect(res.statusCode).toEqual(403);
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
});