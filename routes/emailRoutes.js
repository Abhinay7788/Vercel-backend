const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");
const protect = require("../middleware/authMiddleware");

// 💡 /api/email/send
router.post("/send", protect, emailController.sendLeadEmail);

// 💡 /api/email/resend/:id
router.post("/resend/:id", protect, emailController.resendEmail);

module.exports = router;