const nodemailer = require("nodemailer");
const path = require("path");

const sendEmailWithAttachment = async ({ to, formData, type, attachmentPath }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject =
    type === "bus" ? "🚌 MiTR School Bus Quotation" : "🚚 Ashok Leyland Truck Offer";

  const html = `
    <p>Dear ${formData.vehicleInChargeName || formData.contactPerson || "Customer"},</p>
    <p>Thank you for your interest in Ashok Leyland ${type === "bus" ? "MiTR School Bus" : "Truck"}.</p>
    <p>We will be in touch shortly. Attached is the brochure.</p>
    <p>Regards,<br/>Bhagavathi Rao<br/>Ashok Leyland / Lakshmi Motors<br/>📞 9492113571 </p>
  `;

  const attachments = attachmentPath
    ? [{ filename: path.basename(attachmentPath), path: attachmentPath }]
    : [];

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    attachments,
  });

  console.log(`📧 Email sent to ${to}`);
};

module.exports = sendEmailWithAttachment;
