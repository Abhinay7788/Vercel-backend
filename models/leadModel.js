const mongoose = require("mongoose");

const messageHistorySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["email", "whatsapp"],
    required: true,
  },
  message: String,
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

const statusHistorySchema = new mongoose.Schema({
  status: String,
  changedAt: {
    type: Date,
    default: Date.now,
  },
});

const leadSchema = new mongoose.Schema({
  type: { type: String, required: true }, // "bus" or "truck"

  formData: {
    schoolName: String,
    collegeName: String,
    inChargeName: String,
    inChargePhone: String,
    mileage: String,
    email: String,
    route: String,
    requirement: String,
    strength: String,
    financier: String,
    existingModel: String,
    weakness: String,
    seats: Number,
    numBuses: Number,
    leadScore: Number,
    phone: String,        // fallback if inChargePhone is not present
    contactName: String,  // fallback if inChargeName not present
  },

  location: {
    lat: Number,
    lng: Number,
    address: String,
  },

  status: {
    type: String,
    default: "New",
  },

  messageHistory: [messageHistorySchema],

  statusHistory: [statusHistorySchema],

  score: Number, // AI score (optional)

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Prevent OverwriteModelError in dev or with nodemon
const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
module.exports = Lead;