const express = require("express");
const router = express.Router();
const {authenticateToken} = require("../middleware/authentication");
const pinsController = require("../controllers/pinsController");

// pin a challenge
router.post("/challenges/:challengeId", authenticateToken, pinsController.addPinToChallenge);

//remove pin
router.delete("/challenges/:challengeId", authenticateToken, pinsController.removePinFromChallenge);

module.exports = router;