Since your current database code is using the native **MongoDB driver** (`MongoClient`), you won't be able to use **Mongoose** models (like `User.js`) directly, as they are part of the **Mongoose** ODM (Object Data Modeling) library. Instead, you'll need to interact with your database using the native **MongoDB driver**.

Here’s how you can adapt your **User** logic to work with the native MongoDB driver:

---

### 1. **Create a User Collection and Insert/Find User Logic**

Since you're using the native MongoDB driver, you'll have to manually interact with collections. Here’s how you can handle user signup and login using the **MongoDB native driver**.

#### Create a `controllers/authController.js` for handling authentication logic:

```javascript
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");

const connectToDatabase = require("../database/database"); // Assuming you have this utility

// Signup function
const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      email,
      password: hashedPassword,
    };

    await usersCollection.insertOne(newUser);

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ error: "Server error during signup" });
  }
};

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Check if user exists
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
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

### 2. **Update `authRoutes.js`**

Now, you can update your `routes/authRoutes.js` to use these controller functions.

```javascript
const express = require("express");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

module.exports = router;
```

---

### 3. **Database Connection Update**

In your `database/database.js`, since you're using `MongoClient`, make sure that it connects properly and returns the database instance. You already have the connection logic set up, so no changes are needed there.

---

### 4. **Update the Server**

Ensure that your `server.js` imports and uses the `authRoutes` as shown before:

```javascript
const authRoutes = require("./routes/authRoutes");

// Other middlewares and routes
app.use("/api/auth", authRoutes);
```

---

### 5. **Test the Signup and Login**

Once the setup is complete, test the **signup** and **login** endpoints with a tool like **Postman** or **cURL**.

1. **Signup**:

   ```bash
   curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
   ```

2. **Login**:

   ```bash
   curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
   ```

3. **Access a Protected Route**:
   Use the token you get from the login response to access a protected route:
   ```bash
   curl -X GET http://localhost:5000/api/protected -H "Authorization: Bearer <your_jwt_token>"
   ```

---

### Summary:

- You’re now using the **MongoDB native driver** to handle user authentication.
- The **signup** and **login** routes are now functional with JWT-based authentication.
- The **JWT token** is returned after successful login and can be used for accessing protected routes.

Let me know if you run into any issues or need more assistance! 😊

It looks like you've switched to using **Mongoose** for database connections, which is great if you want to use **Mongoose models** for schema-based data handling.

Since you now have **Mongoose** set up, you’ll need to adjust a few things to ensure consistency with the previous approach. Here’s how you can continue from where you left off:

---

### 1. **Create Mongoose User Model**

In `models/User.js`, define the **Mongoose schema** for users:

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create a model for the user
const User = mongoose.model("User", userSchema);

module.exports = User;
```

This will create a `User` model to interact with your MongoDB users collection.

---

### 2. **Update the `authController.js`**

Now that you're using Mongoose, you can interact with the database through Mongoose models. Here's how you should update the `authController.js`:

```javascript
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Use the Mongoose model

// Signup function
const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ error: "Server error during signup" });
  }
};

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Check if the password matches
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token
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

### 3. **Test the Routes**

Now that you've set up **Mongoose** and updated the authentication logic:

1. **Signup**:

   ```bash
   curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
   ```

2. **Login**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
   ```

If the login is successful, you'll get a **JWT token**.

3. **Protected Route**:
   Use the token from the login response to access a protected route:
   ```bash
   curl -X GET http://localhost:5000/api/protected -H "Authorization: Bearer <your_jwt_token>"
   ```

---

### 4. **Important Notes**

- Ensure that your **MongoDB** server is running, or use **MongoDB Atlas** if you're using a cloud database.
- You should also update your **`.env` file** to include a proper **MongoDB URI** and **JWT_SECRET**:

  ```env
  DATABASE_URL=mongodb://localhost:27017/your_database_name
  JWT_SECRET=your_secret_key
  ```

---

Let me know if everything works or if you run into any issues! 😊
