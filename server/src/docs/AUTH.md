# Authentication Guide – Life Planner App

This document explains how to set up **user authentication** in the backend of our MERN Life Planner App.

Authentication is responsible for:
- User **registration** & profile creation
- **Login / Logout**
- Session or token management (JWT)
- Protecting private routes

---

## 1️⃣ Install Dependencies
```bash
cd server
```
```bash
npm install bcryptjs jsonwebtoken express-validator
```
or
```bash
yarn add bcryptjs jsonwebtoken express-validator
```
(bcryptjs → password hashing, jsonwebtoken → tokens, express-validator → validate inputs)
---

## 2️⃣ Create the User Model
In `models/User.js`, define the User schema:

```javascript
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
```
---

## 3️⃣ Create Auth Controllers
In `controllers/authController.js`, set up routes for registration and login:
```javascript
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, email, password });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (err) {
        next(err);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        next(err);
    }
};

export const logoutUser = (req, res) => {
    res.json({ message: "Logout handled on client (delete token)" });
};
```
---
## 4️⃣ Create Auth Routes
In `routes/authRoutes.js`, set up routes for registration and login:
```javascript
import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Example protected route
router.get("/profile", protect, (req, res) => {
    res.json({ message: `Hello ${req.user.name}` });
});

export default router;

```

---
## 5️⃣ Set Up Middleware for Protected Routes
In `middleware/authMiddleware.js`, create middleware to protect routes:
```javascript
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  res.status(401).json({ message: "Not authorized, no token" });
};
```
---
## 6️⃣ Integrate Routes in the Server
In `server.js`, import and use the auth routes:
```javascript
import authRoutes from "./routes/authRoutes.js";

app.use("/api/auth", authRoutes);
```
---
## 7️⃣ Environment Variables
In your `.env` file, add:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lifeplanner
JWT_SECRET=yourSuperSecretKey
NODE_ENV=development
```
---
## 8️⃣ Testing the Endpoints
Use Postman or Insomnia to test the following endpoints:
- **Register**: `POST /api/auth/register` with body `
    {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "password123"
    }`
- **Login**: `POST /api/auth/login` with body `
    {
        "email": "john@example.com",
        "password": "password123"
    }`
- **Protected Route Example**: Create a test route that uses the `protect` middleware to verify token access.
- **Logout**: `POST /api/auth/logout` (handled on client-side by deleting the token)
---
## Conclusion
You have successfully implemented user authentication in the backend of your MERN Life Planner App!
- Users can register and log in.
- JWT tokens are issued for session management.
- Protected routes ensure only authenticated users can access certain resources.
---
### Authors

Authentication implemented by **Auth Team**.