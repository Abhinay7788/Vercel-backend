const mongoose = require("mongoose");
const User = require("../models/User");

mongoose.connect("mongodb://localhost:27017/ashok_crm") // or your DB name
  .then(async () => {
    const users = await User.find();
    console.log("✅ Existing users:", users);
    process.exit();
  })
  .catch(err => console.error("DB error:", err));