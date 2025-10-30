import express from "express";
import { RegisterUser, LoginUser, LogoutUser } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/logout", LogoutUser);

// Example protected route
router.get("/profile", protect, (req, res) => {
    res.json({ message: `Hello ${req.user.name}` });
});

export default router;