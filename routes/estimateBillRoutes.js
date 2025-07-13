const express = require("express");
const router = express.Router();
const { generateEstimatePDF } = require("../controllers/estimateBillController");

router.post("/pdf", generateEstimatePDF);

module.exports = router;