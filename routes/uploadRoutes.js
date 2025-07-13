const multer = require("multer");
const path = require("path");
const express = require("express");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename });
});

module.exports = router;