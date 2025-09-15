/**
 * @fileoverview Sample model definition
 * @description Defines the schema and model for Sample data
 *
 * @module Sample
 */

import mongoose from 'mongoose';

/**
 * Sample Schema
 * @typedef {Object} SampleSchema
 * @property {String} name - Name of the sample
 * @property {Date} createdAt - Date when the sample was created
 * @property {Date} updatedAt - Date when the sample was last updated
 */
const sampleSchema = new mongoose.Schema({
    // ... your schema fields
}, { timestamps: true });

export const Sample = mongoose.model('Sample', sampleSchema);