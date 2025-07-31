const { setupTestUser } = require("./testUsers");
const { getAllChallenges, getSingleChallenge, createTestChallenge, updateChallenge} = require("../testing/testHelpers");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

describe("Challenges", () => {
    let token, challengeData, userId;
  
    beforeAll(async () => {
      // Set up test user and get their token and user info
      const { token: userToken, user } = await setupTestUser();
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
          title: "Pushup Challenge2",
          description: "Do 500 pushups every day",
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          creator_id: userId,
          created_at: new Date().toISOString()
        }
      });
    });
  
    test("creates a challenge", async () => {
      const res = await createTestChallenge(token, challengeData);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({
        title: "Pushup Challenge2",
        description: "Do 500 pushups every day",
        start_date: expect.any(String),
        end_date: expect.any(String),
        created_at: expect.any(String),
        creator_id: expect.any(Number),
        id: expect.any(Number)
      });
    });
  
    test("get all challenges", async () => {
      const res = await getAllChallenges(token);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([
        {
          created_at: expect.any(String),
          creator_id: expect.any(Number),
          description: "Do 500 pushups every day",
          end_date: expect.any(String),
          id: expect.any(Number),
          start_date: expect.any(String),
          title: "Pushup Challenge2"
        }
      ]);
    });
  
    test("get single challenge", async () => {
      const res = await getSingleChallenge(token, challengeData.id, userId);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        created_at: expect.any(String),
        creator_id: expect.any(Number),
        description: "Do 500 pushups every day",
        end_date: expect.any(String),
        id: expect.any(Number),
        start_date: expect.any(String),
        title: "Pushup Challenge2"
      });
    });
  
    test("update challenge", async () => {
      const dataToUpdate = { description: "Do 5000 pushups every day" };
      const res = await updateChallenge(token, challengeData.id, dataToUpdate);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        created_at: expect.any(String),
        creator_id: expect.any(Number),
        description: "Do 5000 pushups every day",
        end_date: expect.any(String),
        id: expect.any(Number),
        start_date: expect.any(String),
        title: "Pushup Challenge2"
      });
    });
  
    // Edge Case Tests
    test("update challenge without Data to update", async () => {
      const dataToUpdate = 0;
      const res = await updateChallenge(token, challengeData.id, dataToUpdate);
      expect(res.statusCode).toEqual(400);
    });
  
    test("Viewing challenges without being Authorized", async () => {
      const res = await getAllChallenges(challengeData.id);
      expect(res.statusCode).toEqual(403);
    });
  
    test("Viewing a single challenge without being Authorized", async () => {
      const res = await getSingleChallenge(challengeData.id);
      expect(res.statusCode).toEqual(403);
    });
  
    afterAll(async () => {
      await prisma.$disconnect();
    });
  });
  