To add **JWT authentication** to your **Node.js** API server, follow these steps:

---

### 1. **Install Dependencies**

Install the necessary packages for JWT authentication:

```bash
npm install jsonwebtoken bcryptjs express-jwt
```

---

### 2. **Create a JWT Helper Utility**

Create a file `utils/jwt.js` to handle token generation and verification:

```javascript
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Token validity
  );
};

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Access Denied" });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid Token" });
    req.user = user;
    next();
  });
};

module.exports = { generateToken, authenticateToken };
```

---

### 3. **Create Authentication Routes**

Create a new route file `routes/authRoutes.js` for login and signup:

```javascript
const express = require("express");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const User = require("../models/User"); // Assuming you have a User model

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });

    await user.save();
    const token = generateToken(user);

    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user);
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
```

---

### 4. **Update Server File to Include Authentication Routes**

Modify your `server.js` to include the new `authRoutes`:

```javascript
const authRoutes = require("./routes/authRoutes");

// Other middlewares and routes
app.use("/api/auth", authRoutes);
```

---

### 5. **Protect Routes with JWT Middleware**

For any route that requires authentication, apply the `authenticateToken` middleware.

Example (in `routes/uploadRoutes.js`):

```javascript
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
```

---

### 6. **Environment Variables**

Add the following to your `.env` file:

```env
JWT_SECRET=your_secret_key
```

---

### 7. **Test the Endpoints**

1. **Signup**:

   ```bash
   curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
   ```

2. **Login**:

   ```bash
   curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
   ```

   You'll receive a token. Use this token for protected routes.

3. **Protected Route**:
   ```bash
   curl -X POST http://localhost:5000/api/upload -H "Authorization: Bearer <your_jwt_token>" -F "file=@path/to/image.jpg"
   ```

---

### Summary

- **JWT Authentication** is added to your app.
- **Signup/Login** routes handle user authentication.
- Protected routes can now ensure only authenticated users can access them.

Let me know if you need further clarification or help! 😊
