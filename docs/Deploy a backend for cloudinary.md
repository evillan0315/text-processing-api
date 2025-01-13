If you want your upload logic to reside in a standalone **Node.js** backend rather than using a Next.js API route, here's how to set it up:

---

### 1. **Set Up a Node.js Backend**

1. **Initialize a Node.js project**:

   ```bash
   mkdir cloudinary-upload-backend
   cd cloudinary-upload-backend
   npm init -y
   ```

2. **Install dependencies**:
   ```bash
   npm install express multer cloudinary formidable dotenv
   ```

---

### 2. **Create the Node.js API Endpoint**

Create a file `server.js` for your Node.js backend:

```javascript
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

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

// Multer configuration for file uploads
const upload = multer({ dest: "uploads/" });

// Upload endpoint
app.post("/api/upload", upload.single("file"), async (req, res) => {
  const filePath = path.join(__dirname, req.file.path);

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

---

### 3. **Set Environment Variables**

Create a `.env` file in the root of your backend project:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### 4. **Test the Endpoint**

Run the server:

```bash
node server.js
```

Use a tool like **Postman** or **cURL** to test the API:

```bash
curl -X POST -F "file=@path/to/your/image.jpg" http://localhost:5000/api/upload
```

---

### 5. **Connect Frontend to Node.js Backend**

In your **Next.js** frontend, use the following logic to send a file to the Node.js backend:

```javascript
import { useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setImageUrl(data.url);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" style={{ width: "300px" }} />
        </div>
      )}
    </div>
  );
}
```

---

### 6. **Deploy the Backend**

Once you're ready to deploy, consider using services like **Heroku**, **Vercel**, or **Render** to host your Node.js backend. Update the frontend URL accordingly.
