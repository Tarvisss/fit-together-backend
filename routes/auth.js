const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer")

const authController = require("../controllers/authController"); // import the controller
// create a user
router.post("/register", multer.single('image'), authController.registerUser);

// login user
router.post("/login", authController.loginUser);


module.exports = router;

