const express = require("express");
const router = express.Router();
const { exportLeads } = require("../controllers/exportController");

router.get("/excel", exportLeads);

module.exports = router;