/**
 * @fileoverview Application Entry Point
 * @description Main server configuration and initialization
 *
 * @module Server
 */

import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import { connectDB } from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import goalRoutes from "./routes/goalRoute.js"; 
import { startReminderJob } from "./services/reminderService.js";


//  Initialize app first
const app = express();

//  Connect to database
connectDB();

//  Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/goals", goalRoutes); 

//  Start background job
startReminderJob();

//  Test route
app.get('/', (req, res) => {
  res.send('Welcome to the Life Planner App API');
});

//  Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}/`);
});
