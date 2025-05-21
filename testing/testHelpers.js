const request = require("supertest");
const app = require("../app");
const {PrismaClient} = require("../generated/prisma")
const prisma = new PrismaClient();

async function createTestUser(userData) {
    await prisma.users.deleteMany({ where: { username: userData.username } });
  const res = await request(app).post("/auth/register").send(userData);
  return res;
}

//CHALLENGES////////////////////////////////////////////////////////
async function createTestChallenge(token, challengeData) {
  const res = await request(app)
    .post("/challenges")
    .set("Authorization", `Bearer ${token}`)
    .send(challengeData);
  return res;
}

async function getAllChallenges(token){
    const res = await request(app)
        .get("/challenges")
        .set("Authorization", `Bearer ${token}`)
        return res;
}

async function getSingleChallenge(token, challengeId){
    const res = await request(app)
        .get(`/challenges/${challengeId}`)
        .set("Authorization", `Bearer ${token}`)
        return res;
}

async function updateChallenge(token, challengeId, dataToUpdate){
    const res = await request(app)
        .patch(`/challenges/${challengeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(dataToUpdate)
        return res;
}

//COMMENTS/////////////////////////////////////

async function createTestComment(token, challengeId, content){
    const res = await request(app)
        .post(`/challenges/${challengeId}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send({ content });
    return res;
}

async function getTestComments(token, challengeId){
    const res = await request(app)
        .get(`/challenges/${challengeId}/comments`)
        .set("Authorization", `Bearer ${token}`)
    return res;
}

async function getSingleTestComment(token, challengeId,){
    const res = await request(app)
        .get(`/challenges/${challengeId}/comments/${commemtId}`)
        .set("Authorization", `Bearer ${token}`)
    return res;
}

//PINS//////////////////////////////////////////

async function pinChallenge(token, challengeId, ){
    const res = await request(app)
        .post(`/pins/challenges/${challengeId}/pins`)
        .set("Authorization", `Bearer ${token}`)
    return res;
}

async function unPinChallenge(token, challengeId){
    const res = await request(app)
        .delete(`/pins/challenges/${challengeId}/pins`)
        .set("Authorization", `Bearer ${token}`)
    return res;
}

module.exports = {
  //USERS
  createTestUser,

  //CHALLENGES
  createTestChallenge,
  getAllChallenges,
  getSingleChallenge,
  updateChallenge,

  //COMMENTS
  createTestComment,
  getTestComments,
  getSingleTestComment,

  //PINS
  pinChallenge,
  unPinChallenge
};
