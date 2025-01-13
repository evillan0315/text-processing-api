Yes, you can refactor your code to set up routing with **Express** by separating concerns. Here's how you can structure the code:

---

### 1. **Create a Router for Uploads**

Create a new file called `routes/upload.js`:

```javascript
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Multer configuration for file uploads
const upload = multer({ dest: "uploads/" });

// Upload endpoint
router.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = path.join(__dirname, "../", req.file.path);

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "uploads", // Optional: specify a folder
    });

    // Send response
    res.status(200).json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).json({ success: false, error: "Cloudinary upload failed" });
  } finally {
    // Clean up temporary file
    fs.unlinkSync(filePath);
  }
});

module.exports = router;
```

---

### 2. **Modify the Main Server File**

Refactor your `server.js` (or `index.js`) to use the router:

```javascript
const express = require("express");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const uploadRoutes = require("./routes/upload");

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api", uploadRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

---

### 3. **Directory Structure**

Your project structure will look like this:

```
.
├── .env
├── node_modules
├── package.json
├── server.js
├── routes
│   └── upload.js
├── uploads
│   └── (temporary uploaded files)
```

---

### 4. **Run the Server**

1. Start the server:

   ```bash
   node server.js
   ```

2. Test the upload endpoint using a tool like **Postman** or **cURL**:
   ```bash
   curl -X POST -F "file=@path/to/image.jpg" http://localhost:5000/api/upload
   ```

---

This setup keeps your routes modular, making it easier to maintain and scale your application.
