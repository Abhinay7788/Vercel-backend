const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/adminModel');

mongoose.connect('mongodb://localhost:27017/ashok_leads')
  .then(async () => {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new Admin({
      email: "admin@example.com",
      password: hashedPassword,
    });
    await admin.save();
    console.log("✅ Admin created:", admin);
    process.exit();
  })
  .catch(err => {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  });

  const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // adjust if path is different

mongoose.connect("mongodb://localhost:27017/YOUR_DB_NAME")
  .then(async () => {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({ email: "admin@leyland.com", password: hashed });
    console.log("✅ Test user created: admin@leyland.com / admin123");
    process.exit();
  });
