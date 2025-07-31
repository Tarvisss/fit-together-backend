const express = require("express");
const router = express.Router();
const {authenticateToken} = require("../middleware/authentication");
const usersController = require("../controllers/usersController");

//get users route
router.get("/", authenticateToken, usersController.getUsers);

// get single user
router.get("/:username", authenticateToken, usersController.getUser);

// update a user
router.patch("/:username", authenticateToken, usersController.updateUser);

// delete a user
router.delete("/:username", authenticateToken, usersController.deleteUser);

// route for challenges a user has joined(only ids)
router.get("/:id/joined_challenges", authenticateToken, usersController.getUserJoinedChallenges);

router.get("/:id/full_joined_challenges", authenticateToken, usersController.getUserJoinedChallenges);

//get liked challenges
router.get("/:userId/pins", authenticateToken, usersController.getPinnedChallenges);

module.exports = router;
