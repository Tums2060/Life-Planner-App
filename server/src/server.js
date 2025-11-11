/**
 * @fileoverview Application Entry Point
 * @description Main server configuration and initialization
 *
 * @module Server
 */

import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import habitRoutes from './routes/habitRoutes.js'; // ✅ Import habit routes
import { startReminderJob } from './services/reminderService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ===========================
// Middleware
// ===========================
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json()); // Parse JSON bodies

// ===========================
// Routes
// ===========================
app.get('/', (req, res) => {
  res.send('Welcome to the Life Planner App API');
});

app.use('/api/auth', authRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/habits', habitRoutes); // ✅ Register habit routes

// ===========================
// Background Jobs
// ===========================
startReminderJob();

// ===========================
// Database Connection & Server Start
// ===========================
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err.message);
});
