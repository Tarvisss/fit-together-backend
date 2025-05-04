// // routes/users.js
const express = require("express");
const router = express.Router();
const {authenticateToken} = require("../middleware/authentication")
const commentsController = require("../controllers/commentController")

// Create new comment for a challenge

router.post("/:challengeId/comments", authenticateToken, commentsController.createComment);
//gets all comments for a challenge
router.get("/:challengeId/comments", authenticateToken, commentsController.getComments);

// get a single comment by id
router.get("/:challengeId/comments/:id", authenticateToken, commentsController.getComment);

//edit a single comment
router.patch("/:challengeId/comments/:id", authenticateToken, commentsController.updateComment);

//delete a comment
router.delete("/:challengeId/comments/:id", authenticateToken, commentsController.removeComment);


module.exports = router;
