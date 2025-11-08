import express from "express";
import {RegisterUser, LoginUser, LogoutUser, getUserDetails} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users/me", protect, getUserDetails);
router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/logout", LogoutUser);

// Example protected route
router.get("/profile", protect, (req, res) => {
    res.json({ message: `Hello ${req.user.name}` });
});

export default router;