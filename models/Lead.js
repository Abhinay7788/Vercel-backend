const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["bus", "truck"],
      required: true,
    },

    // Common fields
    vehicleInCharge: String,         // ✅ newly added
    contactPerson: String,           // ✅ newly added
    vehicleInChargeName: String,
    vehicleInChargePhone: String,
    phone: String,
    email: String,
    leadScore: Number,
    businessName: String,
    category: String, // Optional
    status: {
      type: String,
      enum: ["New", "Contacted", "Interested", "Converted"],
      default: "New",
    },

    // Location info
    location: {
      lat: Number,
      lng: Number,
      type: String,
    },

    // Bus-specific fields
    schoolName: String,
    collegeName: String,
    mileage: String,
    route: String,
    busSeats: Number,
    numberOfBuses: Number,
    additionalRequirement: String,
    schoolStrength: Number,
    financierDetails: String,
    existingVehicleModel: String,
    existingVehicleStrength: String,
    existingVehicleWeakness: String,
    challenges: String,

    // Truck-specific fields
    truckCount: Number,
    goodsType: String,
    requirement: String,

    // Email/WhatsApp
    pdfUrl: String,
    sentEmail: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);