Sure! Here's how you can refactor your code to include **controllers** for better separation of concerns. We'll create a controller to handle the Cloudinary upload logic and keep the router clean.

---

### 1. **Create a Controller**

Create a file `controllers/uploadController.js`:

```javascript
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
```

---

### 2. **Update the Router**

Modify `routes/upload.js` to use the controller:

```javascript
const express = require("express");
const multer = require("multer");
const { handleFileUpload } = require("../controllers/uploadController");

const router = express.Router();

// Multer configuration for file uploads
const upload = multer({ dest: "uploads/" });

// Route for file upload
router.post("/upload", upload.single("file"), handleFileUpload);

module.exports = router;
```

---

### 3. **Update the Main Server File**

Ensure `server.js` (or `index.js`) imports and uses the router as before:

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

### 4. **Directory Structure**

After adding the controller, your project structure should look like this:

```
.
├── .env
├── controllers
│   └── uploadController.js
├── node_modules
├── package.json
├── routes
│   └── upload.js
├── server.js
├── uploads
│   └── (temporary uploaded files)
```

---

### 5. **Run and Test**

1. Start the server:

   ```bash
   node server.js
   ```

2. Test the endpoint:
   ```bash
   curl -X POST -F "file=@path/to/image.jpg" http://localhost:5000/api/upload
   ```

---

### Benefits of This Setup

- **Separation of Concerns**: The upload logic is in the controller, making it easy to maintain and test.
- **Scalability**: You can add more routes and controllers without cluttering the main server file.
- **Readability**: Each part of the application has a clear role.
