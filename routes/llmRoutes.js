// routes/llmRoutes.js

const express = require("express");
const router = express.Router();
const { getSuggestions } = require("../controllers/llmController");

// ✅ Ensure getSuggestions is a valid function
router.post("/suggest", getSuggestions);

module.exports = router;