const Lead = require("../models/Lead");
const generatePDF = require("../utils/generatePDF");
const sendEmailWithPDF = require("../utils/sendEmail");

const scoreLead = require("../utils/scoreLead"); // ✅ This will now be used

exports.submitLeadForm = async (req, res) => {
  try {
    const { type, formData, location } = req.body;

    // 🧠 AI Lead Score (USE IT here)
    const leadScore = await scoreLead(formData);

    // 1. Save the lead with leadScore
    const newLead = new Lead({ type, formData, location, leadScore });
    const savedLead = await newLead.save();

    // 2. Generate PDF
    const pdfPath = await generatePDF(savedLead);

    // 3. Send Email
    await sendEmailWithPDF(formData.email, "Ashok Leyland – MiTR School Bus", pdfPath);
    savedLead.sentEmail = true;

    // 4. Send WhatsApp
    await sendWhatsAppMessage(formData.vehicleInChargePhone, formData.vehicleInChargeName);
    savedLead.sentWhatsApp = true;

    await savedLead.save();

    res.status(201).json({
      msg: "Lead submitted and notifications sent successfully.",
      leadId: savedLead._id,
      score: leadScore
    });

  } catch (error) {
    console.error("Form + Auto Notify Error:", error);
    res.status(500).json({ msg: "Submission or Notification failed", error: error.message });
  }
};