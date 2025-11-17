import express from "express";
import {
  createHabit,
  getHabits,
  getHabitById,
  completeHabit,
  updateHabit,
  archiveHabit,
  deleteHabit,
} from "../controllers/habitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createHabit).get(protect, getHabits);

router.patch("/:id/complete", protect, completeHabit);
router.patch("/:id/archive", protect, archiveHabit);

router
  .route("/:id")
  .get(protect, getHabitById)
  .put(protect, updateHabit)
  .delete(protect, deleteHabit);

export default router;
