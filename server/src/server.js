/**
 * @fileoverview Application Entry Point
 * @description Main server configuration and initialization
 *
 * @module Server
 */

import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
connectDB();

// Middleware
app.use(express.json());

app.use("/api/auth", authRoutes);

// Route
app.get('/', (req, res) => {
    res.send('Welcome to the Life Planner App API');
})

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});