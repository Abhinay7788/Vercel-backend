const express = require("express");
const router = express.Router();
const {
  submitLead,
  getAllLeads,
  deleteLead,
  resendEmail,
  downloadExcel,
  getLeadById,
  updateLeadStatus,
} = require("../controllers/leadController");
const protect = require("../middleware/authMiddleware");

// ➕ Submit a new lead
router.post("/", protect, submitLead);

// 📋 Get all leads
router.get("/", protect, getAllLeads);

// 🔍 Get a single lead by ID
router.get("/:id", protect, getLeadById);

// ✏️ Update lead status
router.patch("/status/:id", protect, updateLeadStatus);

// ❌ Delete a lead
router.delete("/:id", protect, deleteLead);

// 📧 Resend email
router.post("/resend/:id", protect, resendEmail);

// 📥 Download Excel
router.get("/download/excel", protect, downloadExcel);

module.exports = router;