import express from "express";
import {
  createTimetableEntry,
  getTimetableEntries,
  getTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
} from "../controllers/timetableController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTimetableValidation,
  updateTimetableValidation,
  idValidation,
} from "../middleware/timetableValidation.js";
import { handleValidationErrors } from "../middleware/validationHandler.js";

const router = express.Router();

router.route("/")
  .post(
    protect,
    createTimetableValidation,
    handleValidationErrors,
    createTimetableEntry
  )
  .get(protect, getTimetableEntries);

router.route("/:id")
  .get(
    protect,
    idValidation,
    handleValidationErrors,
    getTimetableEntry
  )
  .put(
    protect,
    idValidation,
    updateTimetableValidation,
    handleValidationErrors,
    updateTimetableEntry
  )
  .delete(
    protect,
    idValidation,
    handleValidationErrors,
    deleteTimetableEntry
  );

export default router;
