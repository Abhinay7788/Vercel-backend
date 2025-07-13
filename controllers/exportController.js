const ExcelJS = require("exceljs");
const Lead = require("../models/leadModel");

exports.exportLeads = async (req, res) => {
  const { from, to, type } = req.query;
  const query = {};

  if (type) query.type = type;
  if (from && to) {
    query.createdAt = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

  const leads = await Lead.find(query);
  const busLeads = leads.filter(l => l.type === "bus");
  const truckLeads = leads.filter(l => l.type === "truck");

  const workbook = new ExcelJS.Workbook();
  const busSheet = workbook.addWorksheet("Bus Leads");
  const truckSheet = workbook.addWorksheet("Truck Leads");

  const busHeaders = [
    "School Name", "Vehicle In-Charge", "Phone", "Email", "Address", "Route",
    "Seats", "Preferred Month", "Usage", "Budget", "Fuel Type", "Competitor",
    "Suggestions", "Score"
  ];
  const truckHeaders = [
    "Customer Name", "Phone", "Email", "Location", "Type",
    "Usage", "Score"
  ];

  busSheet.addRow(busHeaders).font = { bold: true, color: { argb: "FFFFFF" } };
  truckSheet.addRow(truckHeaders).font = { bold: true, color: { argb: "FFFFFF" } };

  busLeads.forEach(l => {
    const f = l.formData;
    busSheet.addRow([
      f.schoolName, f.vehicleInChargeName, f.vehicleInChargePhone, f.email,
      f.address, f.route, f.seatCount, f.purchaseMonth, f.usage,
      f.budget, f.fuelType, f.competitor, f.aiSuggestions?.route, f.score
    ]);
  });

  truckLeads.forEach(l => {
    const f = l.formData;
    truckSheet.addRow([
      f.contactName, f.phone, f.email, f.location,
      f.vehicleType, f.usage, f.score
    ]);
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=leads.xlsx");
  await workbook.xlsx.write(res);
  res.end();
};