# Reminders Module – Life Planner App

The **Reminders module** handles sending notifications for:
- Timetable events
- Goals deadlines/milestones
- Habit streaks

It centralizes all reminder logic, so the app can notify students about upcoming tasks.

---

## 1️⃣ Purpose

- Schedule notifications for timetable events, goals, and habits.
- Allow users to create custom reminders.
- Support CRUD endpoints for custom reminders.
- Provide a service for background jobs.

---

## 2️⃣ Dependencies

Install required packages:

```bash
cd server
```
```bash
npm install express mongoose node-cron nodemailer
```
or

```bash
yarn add express mongoose node-cron nodemailer
```
Note: 
- `nodemailer` is for email notifications; you can replace it with any notification service.
- `node-cron` is for scheduling background jobs/reminders.
- Push notifications or SMS can be added later.

---
## 3️⃣ Create the Reminder Model
Create `models/Reminder.js`:

```javascript
import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["timetable", "goal", "habit", "custom"],
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "type", // Points to the related document
    },
    message: { type: String, required: true },
    remindAt: { type: Date, required: true },
    isSent: { type: Boolean, default: false },
    via: {
      type: String,
      enum: ["email", "push"],
      default: "email",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", reminderSchema);
```
---
## 4️⃣ Create the Reminder Service
Create `services/reminderService.js`:
```javascript
import cron from "node-cron";
import Reminder from "../models/Reminder.js";
import nodemailer from "nodemailer";

// Configure mail transport (for email reminders)
const transporter = nodemailer.createTransport({
  service: "gmail", // or any provider
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send a reminder email
const sendEmail = async (reminder) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: reminder.user.email, // requires populated user
    subject: "Life Planner Reminder",
    text: reminder.message,
  });
};

// Process reminders periodically
export const startReminderJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    const now = new Date();
    const dueReminders = await Reminder.find({
      remindAt: { $lte: now },
      isSent: false,
    }).populate("user");

    for (const reminder of dueReminders) {
      if (reminder.via === "email") {
        await sendEmail(reminder);
      }
      // Add push notification logic here if needed

      reminder.isSent = true;
      await reminder.save();
    }
  });
};
```
---
## 5️⃣ Create the Reminder Controller
Create `controllers/reminderController.js`:
```javascript
import Reminder from "../models/Reminder.js";

// @desc    Create custom reminder
// @route   POST /api/reminders
// @access  Private
export const createReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.create({
      user: req.user._id,
      ...req.body,
    });
    res.status(201).json(reminder);
  } catch (err) {
    next(err);
  }
};

// @desc    Get reminders
// @route   GET /api/reminders
// @access  Private
export const getReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id }).sort({ remindAt: 1 });
    res.json(reminders);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
export const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder || reminder.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Reminder not found" });
    }
    await reminder.deleteOne();
    res.json({ message: "Reminder removed" });
  } catch (err) {
    next(err);
  }
};
```
---
## 6️⃣ Create the Reminder Routes
Create `routes/reminderRoutes.js`:
```javascript
import express from "express";
import { createReminder, getReminders, deleteReminder } from "../controllers/reminderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createReminder)
  .get(protect, getReminders);

router.delete("/:id", protect, deleteReminder);

export default router;
```
---
## 7️⃣ Integrate into the Main App
In `server.js`:
```javascript
import reminderRoutes from "./routes/reminderRoutes.js";
import { startReminderJob } from "./services/reminderService.js";

app.use("/api/reminders", reminderRoutes);
startReminderJob(); // start background job
```
---
## 8️⃣ Sample Request Bodies
### Create Custom Reminder
```http
POST /api/reminders
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
  "type": "custom",
  "message": "Don't forget to review your goals!",
  "remindAt": "2024-12-01T10:00:00Z",
  "via": "email"
}
```
### Get Reminders
```http
GET /api/reminders
```
---
## 9️⃣ Environment Variables
Add to `.env` and `.env.example`:
```env
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
```
---
## 🔟 Enhancements
- Push notifications (via `Firebase` or `OneSignal`).
- SMS reminders (`Twilio`).
- In-app notifications.
- User preferences for reminder channels.

---
## 1️⃣1️⃣ Best Practices
- Only send reminders for the logged-in user.
- Mark reminders as `isSent` after dispatch.
- Secure environment variables (never commit .env).
- Use UTC for scheduling.
---
## 1️⃣2️⃣ Testing
- Unit tests for controller and service functions.
- Integration tests for routes.
- Mock email service for testing reminders.
- Test edge cases (e.g., past reminders, invalid dates).
- Load testing for high volume of reminders.
- User acceptance testing for reminder accuracy.
- Performance testing for background job efficiency.
- Security testing for data protection.
- Cross-browser testing for web notifications.
- Mobile testing for push notifications.
---
### Authors

Reminders implemented by **Reminders Team**.