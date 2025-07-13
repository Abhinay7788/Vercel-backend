const nodemailer = require("nodemailer");

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

  const name =
    formData.vehicleInChargeName ||
    formData.contactPerson ||
    formData.contactName ||
    "Customer";

  const html =
    type === "bus"
      ? `
        <p>Dear ${name},</p>
        <p>We are delighted to introduce the <strong>MiTR School Bus</strong> from <strong>Ashok Leyland</strong>, a trusted name in commercial vehicles across India.</p>
        <p>Specifically designed for school transportation, the MiTR ensures student safety, comfort, and reliability, and is fully BS6-compliant. Key features include:</p>
        <ul>
          <li>✅ Ergonomic seating for maximum comfort</li>
          <li>✅ Superior visibility and advanced safety standards</li>
          <li>✅ Smart design with excellent fuel efficiency</li>
          <li>✅ Easy maintenance and dependable performance</li>
        </ul>
        <p>MiTR buses are already enhancing student transport at schools nationwide. With Ashok Leyland’s legacy of excellence, the MiTR offers a modern, safe, and efficient solution for your institution.</p>
        <p>We would be pleased to arrange a demo or presentation at your convenience.</p>
        <p>Warm regards,<br/>
        Bhagavathi Rao<br/>
        Ashok Leyland / Lakshmi Motors<br/>
        📞 9492113571</p>
      `
      : `
        <p>Dear ${name},</p>
        <p>Thank you for your interest in our <strong>Ashok Leyland Truck</strong> range.</p>
        <p>We’re proud to introduce trucks that offer:</p>
        <ul>
          <li>✅ Powerful engines</li>
          <li>✅ Trusted by fleets like Patanjali</li>
          <li>✅ Easy to maintain</li>
          <li>✅ Built for Indian roads</li>
        </ul>
        <p>We would be happy to assist you with specifications, demo, and financing options.</p>
        <p>Regards,<br/>
        Bhagavathi Rao<br/>
        Lakshmi Motors / Ashok Leyland<br/>
        📞 9492113571</p>
      `;

  const attachments = attachmentPath
    ? [{ filename: "brochure.pdf", path: attachmentPath }]
    : [];

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    attachments,
  });

  console.log("✅ Email sent to:", to);
};

module.exports = sendEmailWithAttachment;