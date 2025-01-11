const express = require("express");
const { processText } = require("../controllers/textProcessorController");

const router = express.Router();

router.post("/process", processText);

module.exports = router;
