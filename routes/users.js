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


module.exports = router;
