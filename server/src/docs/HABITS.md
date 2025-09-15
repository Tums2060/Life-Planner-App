# Habits Module – Life Planner App

The **Habits module** lets students create daily habits, mark completion, and track streaks.

---

## 1️⃣ Purpose

- Allow students to define daily/weekly habits.
- Track progress and streaks for motivation.
- Support CRUD endpoints for the frontend.

---

## 2️⃣ Install Dependencies

No extra dependencies beyond backend core:

```bash
cd server
```
```bash
npm install express mongoose
```
or
```bash
yarn add express mongoose
```
---
## 3️⃣ Create Habits Model
Create `models/Habit.js`:

```javascript
import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompleted: { type: Date },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);
```
---
## 4️⃣ Create Habits Controller
Create `controllers/habitController.js`:
```javascript
import Habit from "../models/Habit.js";

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
export const createHabit = async (req, res, next) => {
  try {
    const habit = await Habit.create({
      user: req.user._id,
      ...req.body,
    });
    res.status(201).json(habit);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all habits for logged-in user
// @route   GET /api/habits
// @access  Private
export const getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isArchived: false }).sort({
      createdAt: -1,
    });
    res.json(habits);
  } catch (err) {
    next(err);
  }
};

// @desc    Mark habit as complete
// @route   PATCH /api/habits/:id/complete
// @access  Private
export const completeHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();
    const last = habit.lastCompleted ? new Date(habit.lastCompleted) : null;

    const isSameDay =
      last &&
      last.getUTCFullYear() === today.getUTCFullYear() &&
      last.getUTCMonth() === today.getUTCMonth() &&
      last.getUTCDate() === today.getUTCDate();

    if (!isSameDay) {
      // Check if yesterday was last completed to maintain streak
      const yesterday = new Date(today);
      yesterday.setUTCDate(today.getUTCDate() - 1);

      const isYesterday =
        last &&
        last.getUTCFullYear() === yesterday.getUTCFullYear() &&
        last.getUTCMonth() === yesterday.getUTCMonth() &&
        last.getUTCDate() === yesterday.getUTCDate();

      habit.currentStreak = isYesterday ? habit.currentStreak + 1 : 1;
      if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
      }
      habit.lastCompleted = today;
      await habit.save();
    }

    res.json(habit);
  } catch (err) {
    next(err);
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
export const updateHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" });
    }
    Object.assign(habit, req.body);
    const updated = await habit.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Archive habit
// @route   PATCH /api/habits/:id/archive
// @access  Private
export const archiveHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" });
    }
    habit.isArchived = true;
    await habit.save();
    res.json({ message: "Habit archived" });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
export const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" });
    }
    await habit.deleteOne();
    res.json({ message: "Habit removed" });
  } catch (err) {
    next(err);
  }
};
```
---
## 5️⃣ Create Habits Routes
Create `routes/habitRoutes.js`:
```javascript
import express from "express";
import {
  createHabit,
  getHabits,
  completeHabit,
  updateHabit,
  archiveHabit,
  deleteHabit,
} from "../controllers/habitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createHabit)
  .get(protect, getHabits);

router.patch("/:id/complete", protect, completeHabit);
router.patch("/:id/archive", protect, archiveHabit);

router
  .route("/:id")
  .put(protect, updateHabit)
  .delete(protect, deleteHabit);

export default router;
```
---
## 6️⃣ Integrate Routes in Server
In `server.js`, add:
```javascript
import habitRoutes from "./routes/habitRoutes.js";
app.use("/api/habits", habitRoutes);
```
---
## 7️⃣ Sample Requests
### Create Habit
```http
POST /api/habits
```
Headers:
```pgsql
{
Authorization: Bearer <token>
Content-Type: application/json
}
```
Body:
```json
{
  "title": "Read 10 pages",
  "description": "Read at least 10 pages of a book",
  "frequency": "daily"
}
```
### Mark Habit Complete
```http
PATCH /api/habits/:id/complete
```
---
## 8️⃣ Enhancements
- Support custom frequencies (e.g., Mon/Wed/Fri).
- Provide analytics (average streak length, missed days).
---
## 9️⃣ Best Practices
- Protect all routes with `protect`.
- Only allow users to modify their own habits.
- Use UTC for date tracking.
- Archive rather than delete for history retention.

---
## 🔟 Testing
- Use Postman or similar to test all endpoints. Ensure proper error handling and data validation.
- Write unit tests for controllers and integration tests for routes.
- Test edge cases (e.g., marking the same habit complete multiple times a day).
- Verify authentication and authorization.
- Check data integrity (streak calculations).
- Test with different user accounts to ensure data isolation.
- Use tools like `Jest` and `Supertest` for automated testing.
---
### Authors

Habits implemented by **Habits Team**.