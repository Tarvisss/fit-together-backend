const express = require("express");
const router = express.Router();
const quoteController = require("../controllers/quoteController")

// get a quote!

router.get("/api/quote", quoteController.getQuote);

module.exports = router;