const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePDF = (lead, fileName = "lead.pdf") => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, "../temp", fileName);
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  doc.fontSize(18).text("Ashok Leyland - Lead Submission", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Lead Type: ${lead.type}`);
  for (const key in lead.formData) {
    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
    doc.text(`${label}: ${lead.formData[key]}`);
  }

  doc.moveDown();
  doc.text("-----------");
  doc.text("We are delighted to introduce the MiTR School Bus from Ashok Leyland, a trusted name in commercial vehicles across India.");
  doc.text("Specifically designed for school transportation, the MiTR ensures student safety, comfort, and reliability.");
  doc.text("✅ Ergonomic seating");
  doc.text("✅ Superior visibility");
  doc.text("✅ Fuel efficiency");
  doc.text("✅ Easy maintenance");
  doc.text("\nWe'd be pleased to arrange a demo or presentation.");

  doc.moveDown();
  doc.text("Regards,");
  doc.text("Bhagavathi Rao");
  doc.text("Lakshmi Motors / Ashok Leyland");
  doc.text("📞 7337449266");

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

module.exports = generatePDF;