require("dotenv").config(); // This should be at the top
const express = require("express");
const cors = require("./middlewares/corsConfig");
const textRoutes = require("./routes/textRoutes");
const testRoutes = require("./routes/testRoutes");
const resultRoutes = require("./routes/resultRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");
const connectToDatabase = require("./database/database");

const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const multer = require("multer");
const app = express();
app.use(bodyParser.json());
app.use(cors);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Connect to the database
connectToDatabase();
const upload = multer({ dest: "uploads/" });
// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/text", textRoutes);
app.use("/api/results", resultRoutes);
app.use("/api", uploadRoutes);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
