const express = require("express");
const { authenticateToken } = require("../utils/jwt");
const { handleFileUpload } = require("../controllers/uploadController");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Protect this route
router.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  handleFileUpload
);

module.exports = router;
