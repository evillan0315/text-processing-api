Sure! Here’s a structured documentation for setting up JWT authentication with Node.js, Express, MongoDB, and Cloudinary, along with detailed steps for each part of the process:

---

## **JWT Authentication Setup with Node.js**

### **Overview**

This guide demonstrates how to set up JWT authentication in a Node.js server with MongoDB and Cloudinary. The steps cover setting up the server, user signup, login, JWT token generation, and token verification for protecting routes.

---

### **Prerequisites**

- Node.js installed on your machine.
- MongoDB running (locally or via MongoDB Atlas).
- Cloudinary account and API credentials (optional for file uploads).

---

### **1. Setting Up the Project**

#### **Install Dependencies:**

In your project directory, run the following commands:

```bash
npm init -y                 # Initialize the project
npm install express mongoose bcryptjs jsonwebtoken multer cloudinary dotenv body-parser cors # Install required dependencies
```

---

### **2. Environment Variables Configuration**

Create a `.env` file in the root directory of your project and add the following:

```env
DATABASE_URL=mongodb://localhost:27017/your_database_name
JWT_SECRET=mySuperSecretKey  # Replace with a strong secret key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Note:** Replace `your_database_name` with your MongoDB database name and provide your Cloudinary credentials if you're using Cloudinary for file uploads.

---

### **3. Server Setup (`server.js`)**

Create and configure the main server file `server.js`:

```javascript
require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("./middlewares/corsConfig");
const textRoutes = require("./routes/textRoutes");
const testRoutes = require("./routes/testRoutes");
const resultRoutes = require("./routes/resultRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const connectToDatabase = require("./database/database");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors); // CORS middleware

// Cloudinary configuration (for file uploads)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
connectToDatabase();

// Define Routes
app.use("/api/text", textRoutes);
app.use("/api/results", resultRoutes);
app.use("/api", uploadRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

### **4. Database Connection (`database/database.js`)**

Configure MongoDB connection using Mongoose:

```javascript
const mongoose = require("mongoose");

const connectToDatabase = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB:", err));
};

module.exports = connectToDatabase;
```

---

### **5. User Model (`models/User.js`)**

Define the `User` model for MongoDB using Mongoose:

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
```

---

### **6. Auth Controller (`controllers/authController.js`)**

Create the authentication logic for signup and login, and generate a JWT token:

```javascript
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ email, password });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ error: "Server error during signup" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User does not exist" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

module.exports = { signup, login };
```

---

### **7. Authentication Routes (`routes/authRoutes.js`)**

Define the routes for user signup and login:

```javascript
const express = require("express");
const { signup, login } = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
```

---

### **8. Protecting Routes with JWT Middleware**

Create a middleware to verify the JWT token:

```javascript
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Expect "Bearer <token>"

  if (!token) return res.status(403).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data to request object
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
```

You can now protect routes by using the `verifyToken` middleware:

```javascript
const verifyToken = require("./middlewares/verifyToken");

app.use("/api/protected", verifyToken, protectedRouteHandler);
```

---

### **9. Testing the API**

#### **Signup**:

To test user signup, use the following cURL command:

```bash
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "yourPassword123"}'
```

#### **Login**:

To test login and receive a token:

```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "yourPassword123"}'
```

#### **Access Protected Routes**:

To test protected routes with the JWT token:

```bash
curl -H "Authorization: Bearer <your_jwt_token>" http://localhost:5000/api/protected
```

---

### **Conclusion**

With these steps, you have successfully set up a Node.js server with JWT authentication. This includes user signup and login, JWT token generation, and route protection using JWT.

---

If you need further modifications or more details, feel free to ask! 😊
