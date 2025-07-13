const mongoose = require("mongoose");
const User = require("../models/User");

mongoose.connect("mongodb://localhost:27017/YOUR_DB_NAME").then(async () => {
  const users = await User.find();
  console.log("✅ Registered users:", users);
  process.exit();
});