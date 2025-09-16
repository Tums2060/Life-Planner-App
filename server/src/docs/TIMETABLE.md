# Timetable Module – Life Planner App

The **Timetable module** lets students add, edit, view, and manage class schedules or events.

---

## 1️⃣ Purpose

- Allow students to create and maintain personal timetables.
- Store class schedules, events, or reminders.
- Support CRUD operations (Create, Read, Update, Delete).
- Provide clean API endpoints for the frontend.

---

## 2️⃣ Install Dependencies

No extra packages are needed beyond core backend deps, but ensure you have the following in `server/`:

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
(express → server, mongoose → MongoDB ODM)
---
## 3️⃣ Create the Timetable Model
In `models/Timetable.js`, define the Timetable schema:

```javascript
import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    location: { type: String },
    isRecurring: { type: Boolean, default: false },
    repeatPattern: {
      type: String,
      enum: ["daily", "weekly", "monthly", "none"],
      default: "none",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Timetable", timetableSchema);
```
---
## 4️⃣ Create Timetable Controllers
In `controllers/timetableController.js`, implement CRUD operations:
```javascript
import Timetable from "../models/Timetable.js";

// @desc    Create new timetable entry
// @route   POST /api/timetable
// @access  Private
export const createEntry = async (req, res, next) => {
  try {
    const { title, description, startTime, endTime, location, isRecurring, repeatPattern } =
      req.body;

    const entry = await Timetable.create({
      user: req.user._id,
      title,
      description,
      startTime,
      endTime,
      location,
      isRecurring,
      repeatPattern,
    });

    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all entries for logged-in user
// @route   GET /api/timetable
// @access  Private
export const getEntries = async (req, res, next) => {
  try {
    const entries = await Timetable.find({ user: req.user._id }).sort({ startTime: 1 });
    res.json(entries);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single entry
// @route   GET /api/timetable/:id
// @access  Private
export const getEntryById = async (req, res, next) => {
  try {
    const entry = await Timetable.findById(req.params.id);
    if (!entry || entry.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json(entry);
  } catch (err) {
    next(err);
  }
};

// @desc    Update entry
// @route   PUT /api/timetable/:id
// @access  Private
export const updateEntry = async (req, res, next) => {
  try {
    const entry = await Timetable.findById(req.params.id);
    if (!entry || entry.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Entry not found" });
    }

    Object.assign(entry, req.body);
    const updated = await entry.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete entry
// @route   DELETE /api/timetable/:id
// @access  Private
export const deleteEntry = async (req, res, next) => {
  try {
    const entry = await Timetable.findById(req.params.id);
    if (!entry || entry.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Entry not found" });
    }
    await entry.deleteOne();
    res.json({ message: "Entry removed" });
  } catch (err) {
    next(err);
  }
};
```
---
## 5️⃣ Set Up Timetable Routes
In `routes/timetableRoutes.js`, define the routes:
```javascript
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
```
---
## 6️⃣ Integrate Routes in Server
In `server.js`, import and use the timetable routes:
```javascript
import timetableRoutes from "./routes/timetableRoutes.js";

app.use("/api/timetable", timetableRoutes);
```
---
## 7️⃣ Sample Requests
### Create Timetable Entry
```http
POST /api/timetable
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
  "title": "Math Class",
  "description": "Calculus lecture",
  "startTime": "2024-09-01T10:00:00Z",
  "endTime": "2024-09-01T11:00:00Z",
  "location": "Room 101",
  "isRecurring": true,
  "repeatPattern": "weekly"
}
```
### Get All Entries
```http
GET /api/timetable
```
## 8️⃣ Validation & Enhancements
- Add request validation using libraries like `Joi` or `express-validator`.
- Implement pagination for listing entries.
- Add search/filter capabilities (e.g., by date range).
- Consider timezone handling for start/end times.

## 9️⃣ Best Practices
- Always protect routes with protect middleware.
- Ensure the logged-in user can only access their own entries.
- Validate startTime < endTime.
- Use UTC in DB, convert to local time in frontend.

### Authors

Timetables implemented by **Timetable Team**.