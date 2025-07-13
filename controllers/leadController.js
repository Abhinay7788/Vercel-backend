const mongoose = require("mongoose");
const Lead = require("../models/Lead");
const sendEmailWithAttachment = require("../utils/sendEmailWithAttachment");
const exportLeadsToExcel = require("../utils/exportToExcel");

/* -------------------- ✅ Submit a new lead -------------------- */
const submitLead = async (req, res) => {
  try {
    const leadData = req.body;
    if (!leadData.type) {
      return res.status(400).json({ message: "Lead 'type' is required." });
    }
    // 👇 Fill 'vehicleInCharge' if missing for bus
    if (leadData.type === "bus") {
      if (!leadData.vehicleInCharge && leadData.contactPerson) {
        leadData.vehicleInCharge = leadData.contactPerson;
      }
    }

    const newLead = new Lead(leadData);
    const savedLead = await newLead.save();

    if (leadData.email) {
      const brochurePath =
        leadData.type === "bus"
          ? "./public/brochures/mitra.pdf"
          : "./public/brochures/truck.pdf";

      await sendEmailWithAttachment({
        to: leadData.email,
        formData: leadData,
        type: leadData.type,
        attachmentPath: brochurePath,
      });
    }

    res.status(201).json({ message: "✅ Lead submitted successfully", lead: savedLead });
  } catch (err) {
    console.error("❌ Error submitting lead:", err);
    res.status(500).json({ message: "Failed to submit lead", error: err.message });
  }
};

/* -------------------- ✅ Get all leads -------------------- */
const getAllLeads = async (_req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (err) {
    console.error("❌ Error fetching leads:", err);
    res.status(500).json({ message: "Failed to fetch leads" });
  }
};

/* -------------------- ✅ Get lead by ID -------------------- */
const getLeadById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid lead ID" });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.status(200).json(lead);
  } catch (err) {
    console.error("❌ Error fetching lead:", err);
    res.status(500).json({ message: "Failed to fetch lead" });
  }
};

/* -------------------- ✅ Update lead status -------------------- */
const updateLeadStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid lead ID" });
    }

    const { status } = req.body;
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedLead) return res.status(404).json({ message: "Lead not found" });

    res.status(200).json(updatedLead);
  } catch (err) {
    console.error("❌ Error updating lead status:", err);
    res.status(500).json({ message: "Failed to update lead status" });
  }
};

/* -------------------- ✅ Delete lead -------------------- */
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const deleted = await Lead.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Lead not found" });

    res.json({ message: "Lead deleted" });
  } catch (err) {
    console.error("❌ Error deleting lead:", err);
    res.status(500).json({ message: "Failed to delete lead" });
  }
};

/* -------------------- ✅ Export leads to Excel -------------------- */
const downloadExcel = async (req, res) => {
  try {
    const { type, scoreMin, scoreMax, startDate, endDate, headersOnly } = req.query;
    const filter = {};

    if (type && type !== "All") filter.type = type.toLowerCase();
    if (scoreMin && scoreMax)
      filter.leadScore = { $gte: parseInt(scoreMin), $lte: parseInt(scoreMax) };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate + "T23:59:59");
    }

    const leads = await Lead.find(filter);

    const busLeads = leads.filter((lead) => lead.type === "bus");
    const truckLeads = leads.filter((lead) => lead.type === "truck");

    const buffer = await exportLeadsToExcel(
      { busLeads, truckLeads },
      headersOnly === "true"
    );

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=AshokLeyland_Leads.xlsx`);
    res.send(buffer);
  } catch (err) {
    console.error("❌ Error exporting Excel:", err);
    res.status(500).json({ error: "Failed to export Excel" });
  }
};

/* -------------------- ✅ Resend email -------------------- */
const resendEmail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const lead = await Lead.findById(id);
    if (!lead || !lead.email) {
      return res.status(404).json({ error: "Email not found for this lead" });
    }

    const brochurePath =
      lead.type === "bus"
        ? "./public/brochures/mitra.pdf"
        : "./public/brochures/truck.pdf";

    await sendEmailWithAttachment({
      to: lead.email,
      formData: lead.toObject(),
      type: lead.type,
      attachmentPath: brochurePath,
    });

    res.json({ message: "📧 Email resent successfully!" });
  } catch (err) {
    console.error("❌ Error resending email:", err);
    res.status(500).json({ error: "Failed to resend email" });
  }
};

module.exports = {
  submitLead,
  getAllLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
  downloadExcel,
  resendEmail,
};