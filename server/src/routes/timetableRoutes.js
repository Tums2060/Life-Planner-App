import express from "express";
import {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
} from "../controllers/timetableController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createEntry)
  .get(protect, getEntries);

router
  .route("/:id")
  .get(protect, getEntryById)
  .put(protect, updateEntry)
  .delete(protect, deleteEntry);

export default router;
