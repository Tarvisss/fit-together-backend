const express = require("express");
const router = express.Router();
const {authenticateToken} = require("../middleware/authentication");
const likesController = require("../controllers/likesController");

// Like a challenge
router.post("/:commentId", authenticateToken, likesController.addLikeToComment );

//remove like
router.delete("/:commentId", authenticateToken, likesController.removeLike);

module.exports = router;