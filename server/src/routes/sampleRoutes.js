/**
 * @fileoverview Sample Routes
 * @description Define routes for Sample-related operations
 *
 * @module SampleRoutes
 */

import express from 'express';
import { getAllSamples, createSample /* ... other controllers */ } from '../controllers/sampleController.js';

/**
 * Express router configuration for Sample API endpoints
 *
 * Available routes:
 * - GET /samples - Retrieve all samples
 * - POST /samples - Create a new sample
 * - GET /samples/:id - Retrieve a specific sample
 * - PUT /samples/:id - Update a specific sample
 * - DELETE /samples/:id - Delete a specific sample
 *
 * @type {express.Router}
 */