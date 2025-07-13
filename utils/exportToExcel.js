const ExcelJS = require("exceljs");

const exportLeadsToExcel = async (
  { busLeads = [], truckLeads = [], combinedLeads = [] },
  headersOnly = false
) => {
  const workbook = new ExcelJS.Workbook();

  // ✅ BUS Columns
  const busColumns = [
    { header: "School Name", key: "schoolName", width: 20 },
    { header: "College Name", key: "collegeName", width: 20 },
    { header: "In-Charge", key: "inCharge", width: 20 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Mileage", key: "mileage", width: 10 },
    { header: "Email", key: "email", width: 25 },
    { header: "Route", key: "route", width: 25 },
    { header: "School Strength", key: "schoolStrength", width: 12 },
    { header: "Financier", key: "financierDetails", width: 15 },
    { header: "Vehicle Model", key: "existingVehicleModel", width: 15 },
    { header: "Vehicle Strength", key: "existingVehicleStrength", width: 15 },
    { header: "Vehicle Weakness", key: "existingVehicleWeakness", width: 15 },
    { header: "Bus Seats", key: "busSeats", width: 10 },
    { header: "Number of Buses", key: "numberOfBuses", width: 12 },
    { header: "Lead Score", key: "leadScore", width: 10 },
    { header: "Status", key: "status", width: 12 },
    { header: "Submitted On", key: "createdAt", width: 20 },
  ];

  // ✅ TRUCK Columns
  const truckColumns = [
    { header: "Contact Person", key: "inCharge", width: 20 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Email", key: "email", width: 25 },
    { header: "Goods Type", key: "goodsType", width: 20 },
    { header: "Requirement", key: "requirement", width: 25 },
    { header: "Truck Count", key: "truckCount", width: 12 },
    { header: "Lead Score", key: "leadScore", width: 10 },
    { header: "Status", key: "status", width: 12 },
    { header: "Submitted On", key: "createdAt", width: 20 },
  ];

  // ✅ Add Sheet Helper
  const addSheet = (sheetName, data, columns, type = "bus") => {
    const sheet = workbook.addWorksheet(sheetName);
    sheet.columns = columns;

    // Style headers
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: type === "bus" ? "FFCCE5FF" : "FFFFE599" },
      };
    });

    if (!headersOnly) {
      data.forEach((lead) => {
        const form = lead.formData || lead;

        const rowData =
          type === "bus"
            ? {
                schoolName: form.schoolName || "",
                collegeName: form.collegeName || "",
                inCharge: form.inCharge || form.vehicleInCharge || form.vehicleInChargeName || "",
                phone: form.phone || form.vehicleInChargePhone || "",
                mileage: form.mileage || "",
                email: form.email || "",
                route: form.preferredRoute || form.route || "",
                schoolStrength: form.schoolStrength || form.studentCount || "",
                financierDetails: form.financierDetails || "",
                existingVehicleModel: form.existingVehicleModel || "",
                existingVehicleStrength: form.existingVehicleStrength || "",
                existingVehicleWeakness: form.existingVehicleWeakness || "",
                busSeats: form.busSeats || form.busType || "",
                numberOfBuses: form.numberOfBuses || form.busCount || "",
                leadScore: lead.score ?? lead.leadScore ?? 50,
                status: lead.status || "New",
                createdAt: new Date(lead.createdAt).toLocaleString(),
              }
            : {
                inCharge:
                  form.contactPerson || form.inCharge || form.vehicleInCharge || "",
                phone: form.phone || "",
                email: form.email || "",
                goodsType: form.goodsType || form.truckType || "",
                requirement: form.requirement || "",
                truckCount: form.truckCount || form.quantity || "",
                leadScore: lead.score ?? lead.leadScore ?? 50,
                status: lead.status || "New",
                createdAt: new Date(lead.createdAt).toLocaleString(),
              };

        sheet.addRow(rowData);
      });
    }
  };

  // ✅ Prepare Leads
  const resolvedBusLeads = busLeads.length
    ? busLeads
    : combinedLeads.filter((l) => l.type === "bus");

  const resolvedTruckLeads = truckLeads.length
    ? truckLeads
    : combinedLeads.filter((l) => l.type === "truck");

  // ✅ Create Sheets
  addSheet("Bus Leads", resolvedBusLeads, busColumns, "bus");
  addSheet("Truck Leads", resolvedTruckLeads, truckColumns, "truck");

  // ✅ Return as Buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = exportLeadsToExcel;