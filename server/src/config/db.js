/**
 * @fileoverview Database Configuration
 * @description Handles database connection and configuration
 *
 * @module Database
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Establishes connection to MongoDB database
 * @async
 * @function connect
 * @returns {Promise<void>}
 * @throws {Error} If connection fails
 */
export const connectDB = async () => {
    try{
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error("MongoDB URI is missing. Set MONGODB_URI (or MONGO_URI) in environment variables.");
        }

        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};