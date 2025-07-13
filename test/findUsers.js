const mongoose = require("mongoose");
const User = require("../models/User"); // Adjust if your path differs

mongoose.connect("mongodb://localhost:27017/YOUR_DB_NAME")
  .then(async () => {
    const users = await User.find();
    console.log("✅ Users in DB:", users);
    process.exit();
  })
  .catch(err => {
    console.error("❌ DB error:", err);
    process.exit(1);
  });