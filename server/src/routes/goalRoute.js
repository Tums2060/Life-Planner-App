import express from "express";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// /api/goals
router.route("/")
  .post(protect, createGoal)
  .get(protect, getGoals);

// /api/goals/:id
router
  .route("/:id")
  .patch(protect, updateGoal)
  .delete(protect, deleteGoal);

export default router;
