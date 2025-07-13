// backend/tools/createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

mongoose.connect("mongodb://localhost:27017/YOUR_DB_NAME").then(async () => {
  const email = "admin@example.com";
  const password = await bcrypt.hash("admin123", 10);

  const admin = new User({
    email,
    password,
    role: "admin"
  });

  await admin.save();
  console.log("✅ Admin created");
  process.exit();
});