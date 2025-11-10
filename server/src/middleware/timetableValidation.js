import { body, param } from "express-validator";

/**
 * Validation rules for creating a timetable entry
 */
export const createTimetableValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title must not exceed 100 characters"),
  
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  
  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Start time must be a valid date"),
  
  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .isISO8601()
    .withMessage("End time must be a valid date")
    .custom((endTime, { req }) => {
      if (new Date(endTime) <= new Date(req.body.startTime)) {
        throw new Error("End time must be after start time");
      }
      return true;
    }),
  
  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Location must not exceed 200 characters"),
  
  body("isRecurring")
    .optional()
    .isBoolean()
    .withMessage("isRecurring must be a boolean"),
  
  body("repeatPattern")
    .optional()
    .isIn(["daily", "weekly", "monthly", "none"])
    .withMessage("Repeat pattern must be one of: daily, weekly, monthly, none"),
];

/**
 * Validation rules for updating a timetable entry
 */
export const updateTimetableValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Title must not exceed 100 characters"),
  
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  
  body("startTime")
    .optional()
    .isISO8601()
    .withMessage("Start time must be a valid date"),
  
  body("endTime")
    .optional()
    .isISO8601()
    .withMessage("End time must be a valid date"),
  
  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Location must not exceed 200 characters"),
  
  body("isRecurring")
    .optional()
    .isBoolean()
    .withMessage("isRecurring must be a boolean"),
  
  body("repeatPattern")
    .optional()
    .isIn(["daily", "weekly", "monthly", "none"])
    .withMessage("Repeat pattern must be one of: daily, weekly, monthly, none"),
];

/**
 * Validation rules for MongoDB ObjectId parameters
 */
export const idValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid timetable entry ID"),
];
