const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");

// Cloudinary configuration (already loaded in main server file)
const uploadToCloudinary = async (filePath) => {
  return cloudinary.uploader.upload(filePath, {
    folder: "uploads", // Optional: specify a folder
  });
};

const handleFileUpload = async (req, res) => {
  const filePath = path.join(__dirname, "../", req.file.path);

  try {
    const result = await uploadToCloudinary(filePath);

    res.status(200).json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).json({ success: false, error: "Cloudinary upload failed" });
  } finally {
    // Clean up temporary file
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  handleFileUpload,
};
