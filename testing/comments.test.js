const { setupTestUser2 } = require("./testUsers");
const { createTestComment, getTestComments, createTestChallenge} = require("../testing/testHelpers");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

describe("Challenges", () => {
    let token, challengeData, userId;
  
    beforeAll(async () => {
      // Set up test user and get their token and user info
      const { token: userToken, user } = await setupTestUser2();
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
          title: "Pushup Challenge",
          description: "Do 50 pushups every day",
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          creator_id: userId,
          created_at: new Date().toISOString()
        }
      });
    });

  
  test("creates a comment", async () => {
    const testContent = "Nice challenge!";
    const res = await createTestComment(token, challengeData.id, testContent);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      content: testContent,
      challenge_id: challengeData.id,
      created_at: expect.any(String),
      user_id: expect.any(Number),
      id: expect.any(Number)
    });
  });

  test("gets all comments", async () => {
    const res = await getTestComments(token, challengeData.id);

    expect(res.statusCode).toEqual(200);
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });

});