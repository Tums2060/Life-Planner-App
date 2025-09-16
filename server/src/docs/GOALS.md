# Goals Module – Life Planner App

The **Goals module** allows students to set academic or personal goals, define milestones, and track progress.

---

## 1️⃣ Purpose

- Enable students to create and manage goals.
- Support progress tracking and completion status.
- Provide CRUD endpoints for the frontend.

---

## 2️⃣ Install Dependencies

No additional packages beyond the backend’s core ones:

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
## 3️⃣ Goal Schema Model
Create a new file `models/Goal.js`:

```javascript
import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    dueDate: { type: Date },
  },
  { _id: false }
);

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ["academic", "personal"], default: "academic" },
    deadline: { type: Date },
    milestones: [milestoneSchema],
    progress: { type: Number, default: 0 }, // 0–100 %
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Goal", goalSchema);
```
---
## 4️⃣ Goal Controller
Create a new file `controllers/goalController.js`:
```javascript
import Goal from "../models/Goal.js";

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res, next) => {
  try {
    const goal = await Goal.create({
      user: req.user._id,
      ...req.body,
    });
    res.status(201).json(goal);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all goals for a user
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
export const getGoalById = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal || goal.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res.json(goal);
  } catch (err) {
    next(err);
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal || goal.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Goal not found" });
    }
    Object.assign(goal, req.body);
    const updated = await goal.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal || goal.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Goal not found" });
    }
    await goal.deleteOne();
    res.json({ message: "Goal removed" });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark milestone as complete & update progress
// @route   PATCH /api/goals/:id/milestone
// @access  Private
export const updateMilestone = async (req, res, next) => {
  try {
    const { milestoneTitle, isCompleted } = req.body;
    const goal = await Goal.findById(req.params.id);
    if (!goal || goal.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const milestone = goal.milestones.find(m => m.title === milestoneTitle);
    if (milestone) {
      milestone.isCompleted = isCompleted;
    }

    const total = goal.milestones.length || 1;
    const done = goal.milestones.filter(m => m.isCompleted).length;
    goal.progress = Math.round((done / total) * 100);
    goal.isCompleted = goal.progress === 100;

    const updated = await goal.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
```
---
## 5️⃣ Goal Routes
Create a new file `routes/goalRoutes.js`:
```javascript
import express from "express";
import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  updateMilestone,
} from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createGoal)
  .get(protect, getGoals);

router
  .route("/:id")
  .get(protect, getGoalById)
  .put(protect, updateGoal)
  .delete(protect, deleteGoal);

router.patch("/:id/milestone", protect, updateMilestone);

export default router;
```
---
## 6️⃣ Integrate Routes in Server
In `server.js` add:
```javascript
import goalRoutes from "./routes/goalRoutes.js";
app.use("/api/goals", goalRoutes);
```
---
## 7️⃣ Sample Requests
### Create Goal
```http
POST /api/goals
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
  "title": "Finish Term Paper",
  "description": "Complete research and write paper for History class",
  "category": "academic",
  "deadline": "2025-10-15T23:59:00.000Z",
  "milestones": [
    { "title": "Research topic", "dueDate": "2025-09-30" },
    { "title": "Write first draft", "dueDate": "2025-10-05" }
  ]
}
```
### Update Milestone
```http
PATCH /api/goals/<goal_id>/milestone
```
Body:
```json
{
  "milestoneTitle": "Research topic",
  "isCompleted": true
}
```
### Get All Goals
```http
GET /api/goals
```
### Get Single Goal
```http
GET /api/goals/<goal_id>
```
### Update Goal
```http
PUT /api/goals/<goal_id>
```
Body:
```json
{
  "title": "Finish Term Paper Updated",
  "description": "Updated description"
}
```
### Delete Goal
```http
DELETE /api/goals/<goal_id>
```
---
## 8️⃣ Enhancements
- Add validation with `Joi` or `express-validator`.
- Enable notifications/reminders for deadlines.
- Allow attaching resources (links/files).
- Support goal prioritization and categories.

---
## 9️⃣ Best Practices
- Protect every route with `protect`.
- Only allow owners to modify their goals.
- Keep progress as a derived field based on milestones.
- Use UTC for all dates.
---
### Authors

Goals implemented by **Goals Team**.