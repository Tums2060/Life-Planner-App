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
import authRoutes from "./routes/authRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import { startReminderJob } from "./services/reminderService.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();
connectDB();

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/reminders", reminderRoutes);
startReminderJob();

app.use("/api/contact", contactRoutes);



// Route
app.get('/', (req, res) => {
    res.send('Welcome to the Life Planner App API');
})

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});