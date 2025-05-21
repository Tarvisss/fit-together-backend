const express = require("express");
const router = express.Router();
const {authenticateToken} = require("../middleware/authentication");
const pinsController = require("../controllers/pinsController");

// pin a challenge
router.post("/challenges/:challengeId/pins", authenticateToken, pinsController.addPinToChallenge);

//remove pin
router.delete("/challenges/:challengeId/pins", authenticateToken, pinsController.removePinFromChallenge);

module.exports = router;