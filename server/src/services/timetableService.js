import Timetable from "../models/Timetable.js";

/**
 * @desc    Create a new timetable entry
 * @param   {Object} entryData - Timetable entry data
 * @param   {String} userId - User ID
 * @returns {Promise<Object>} Created timetable entry
 */
export const createTimetableEntryService = async (entryData, userId) => {
  const entry = await Timetable.create({
    user: userId,
    ...entryData,
  });
  return entry;
};

/**
 * @desc    Get all timetable entries for a user
 * @param   {String} userId - User ID
 * @returns {Promise<Array>} Array of timetable entries
 */
export const getTimetableEntriesService = async (userId) => {
  const entries = await Timetable.find({ user: userId }).sort({ startTime: 1 });
  return entries;
};

/**
 * @desc    Get a single timetable entry by ID
 * @param   {String} entryId - Entry ID
 * @param   {String} userId - User ID
 * @returns {Promise<Object>} Timetable entry
 */
export const getTimetableEntryService = async (entryId, userId) => {
  const entry = await Timetable.findById(entryId);
  
  if (!entry) {
    throw new Error("Entry not found");
  }
  
  if (entry.user.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }
  
  return entry;
};

/**
 * @desc    Update a timetable entry
 * @param   {String} entryId - Entry ID
 * @param   {Object} updateData - Data to update
 * @param   {String} userId - User ID
 * @returns {Promise<Object>} Updated timetable entry
 */
export const updateTimetableEntryService = async (entryId, updateData, userId) => {
  const entry = await Timetable.findById(entryId);
  
  if (!entry) {
    throw new Error("Entry not found");
  }
  
  if (entry.user.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }
  
  Object.assign(entry, updateData);
  const updatedEntry = await entry.save();
  
  return updatedEntry;
};

/**
 * @desc    Delete a timetable entry
 * @param   {String} entryId - Entry ID
 * @param   {String} userId - User ID
 * @returns {Promise<void>}
 */
export const deleteTimetableEntryService = async (entryId, userId) => {
  const entry = await Timetable.findById(entryId);
  
  if (!entry) {
    throw new Error("Entry not found");
  }
  
  if (entry.user.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }
  
  await entry.deleteOne();
};
