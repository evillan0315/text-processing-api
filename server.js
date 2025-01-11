require('dotenv').config();  // This should be at the top
const express = require("express");
const cors = require("./middlewares/corsConfig");
const textRoutes = require("./routes/textRoutes");
const resultRoutes = require("./routes/resultRoutes");
const connectToDatabase = require("./database/database");

const app = express();
app.use(express.json());
app.use(cors);

// Connect to the database
connectToDatabase();

// Define routes
app.use("/api/text", textRoutes);
app.use("/api/results", resultRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
