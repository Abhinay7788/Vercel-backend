// backend/tools/createUser.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

mongoose.connect("mongodb://localhost:27017/ashok_crm").then(async () => {
  const password = await bcrypt.hash("admin123", 10);
  const user = new User({ email: "admin@example.com", password });
  await user.save();
  console.log("✅ User created");
  process.exit();
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});
