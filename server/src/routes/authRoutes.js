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