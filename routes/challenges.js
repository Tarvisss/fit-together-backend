// routes/users.js
const express = require("express");
const router = express.Router();
const {authenticateToken} = require("../middleware/authentication")
const challengeController = require("../controllers/challengesController");
//gets a list of all challenges
router.get("/", authenticateToken, challengeController.getChallenges);

// route to create a challenge;
router.post("/", authenticateToken, challengeController.createChallenge)

// get a challenge by the title
router.get("/:id", authenticateToken, challengeController.getChallenge);

//patch route to update a challenge
router.patch("/:id", authenticateToken, challengeController.updateChallenge);

// //Route to delete a user
router.delete("/:id", authenticateToken, challengeController.removeChallenge);

router.post("/:challengeId/join", authenticateToken, challengeController.joinChallenge);
  
// Route to leave a challenge
router.delete("/:challengeId/leave", authenticateToken, challengeController.leaveChallenge);

module.exports = router;
