import express from "express";
import { createReminder, getReminders, deleteReminder } from "../controllers/reminderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
    .post(protect, createReminder)
    .get(protect, getReminders);

router.delete("/:id", protect, deleteReminder);

export default router;