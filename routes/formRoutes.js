const express = require("express");
const router = express.Router();
const { submitLeadForm } = require("../controllers/formController");
const protect = require("../middleware/authMiddleware");

// Auth-protected form submission route
router.post("/submit", protect, submitLeadForm);

module.exports = router;