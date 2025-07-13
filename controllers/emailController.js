const Lead = require("../models/Lead");
const generateEstimatePDF = require("../utils/generatePDF");
const sendEmailWithAttachment = require("../utils/emailService");
const path = require("path");

// 🔁 Resend email to a specific lead by ID
const resendEmail = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const { formData, type } = lead;
    const isBus = type === "bus";

    const name = formData.vehicleInChargeName || formData.contactName;
    const email = formData.email;
    const pdfPath = await generateEstimatePDF({ ...formData, type });

    const brochurePath = isBus
      ? path.join(__dirname, "../public/brochures/mitra.pdf")
      : path.join(__dirname, "../public/brochures/truck.pdf");

    const emailText = isBus
      ? `Hi ${name},\n\nResending your estimate and brochure for the MiTR School Bus.`
      : `Hi ${name},\n\nHere is your requested Ashok Leyland Truck estimate and brochure.`;

    const attachments = [
      { filename: "Estimate.pdf", path: pdfPath },
      {
        filename: isBus ? "Mitra_Brochure.pdf" : "Truck_Brochure.pdf",
        path: brochurePath,
      },
    ];

    await sendEmailWithAttachment({
      to: email,
      subject: `Ashok Leyland - Estimate & ${isBus ? "MiTR Brochure" : "Truck Info"}`,
      text: emailText,
      attachments,
    });

    lead.messageHistory.push({
      type: "email",
      message: `Resent estimate & brochure to ${email}`,
      sentAt: new Date(),
    });

    await lead.save();

    res.json({ message: "Email resent successfully" });
  } catch (err) {
    console.error("Resend Email Error:", err);
    res.status(500).json({ message: "Resend failed" });
  }
};

// 📤 Send email manually via API
const sendLeadEmail = async (req, res) => {
  try {
    const { to, subject, message, attachment } = req.body;

    await sendEmailWithAttachment(to, subject, message, attachment);

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};

// ✅ Export both
module.exports = {
  resendEmail,
  sendLeadEmail,
};