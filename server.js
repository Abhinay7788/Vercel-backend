const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", require("./routes/authRoutes"));                   // Login/Signup
app.use("/api/form", require("./routes/formRoutes"));                   // Lead form submission
app.use("/api/lead", require("./routes/leadRoutes"));                   // Lead management
app.use("/api/llm", require("./routes/llmRoutes"));                     // AI suggestions
app.use("/api/upload", require("./routes/uploadRoutes"));               // File uploads
app.use("/api/email", require("./routes/emailRoutes"));                 // Email handling
app.use("/api/estimatebill", require("./routes/estimateBillRoutes"));   // PDF/Estimate generation

// ✅ Static File Serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/brochures", express.static(path.join(__dirname, "public/brochures")));
app.use("/public", express.static(path.join(__dirname, "public")));

// ✅ Fallback Route for 404 API paths
app.use((req, res) => {
  res.status(404).json({ message: "API route not found." });
});

// ✅ Server Launch
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));