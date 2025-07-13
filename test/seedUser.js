const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

mongoose.connect("mongodb://localhost:27017/YOUR_DB_NAME").then(async () => {
  const hashed = await bcrypt.hash("admin123", 10);
  await User.create({ email: "admin@leyland.com", password: hashed });
  console.log("✅ Seeded test user");
  process.exit();
});