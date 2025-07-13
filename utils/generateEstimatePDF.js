const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");

const generateEstimatePDF = async (data) => {
  const htmlTemplatePath = path.join(__dirname, "../templates/estimateTemplate.ejs");
  const html = await ejs.renderFile(htmlTemplatePath, { data });

  const filePath = path.join(__dirname, `../generated/estimate_${Date.now()}.pdf`);

  return new Promise((resolve, reject) => {
    pdf.create(html, {}).toFile(filePath, (err, res) => {
      if (err) {
        console.error("❌ PDF generation failed:", err);
        reject(err);
      } else {
        console.log("📄 PDF created:", res.filename);
        resolve(res.filename);
      }
    });
  });
};

module.exports = generateEstimatePDF;