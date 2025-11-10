import Timetable from "../models/Timetable.js";

// @desc    Create timetable entry
// @route   POST /api/timetable
// @access  Private
export const createTimetableEntry = async (req, res, next) => {
  try {
    const { title, description, startTime, endTime, location, isRecurring, repeatPattern } = req.body;

    const timetableEntry = await Timetable.create({
      user: req.user._id,
      title,
      description,
      startTime,
      endTime,
      location,
      isRecurring,
      repeatPattern,
    });
    
    res.status(201).json(timetableEntry);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all timetable entries
// @route   GET /api/timetable
// @access  Private
export const getTimetableEntries = async (req, res, next) => {
  try {
    const entries = await Timetable.find({ user: req.user._id }).sort({ startTime: 1 });
    res.json(entries);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single timetable entry
// @route   GET /api/timetable/:id
// @access  Private
export const getTimetableEntry = async (req, res, next) => {
  try {
    const entry = await Timetable.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ message: "Timetable entry not found" });
    }

    // Verify ownership
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this entry" });
    }
    
    res.json(entry);
  } catch (err) {
    // Handle invalid MongoDB ObjectId
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Timetable entry not found" });
    }
    next(err);
  }
};

// @desc    Update timetable entry
// @route   PUT /api/timetable/:id
// @access  Private
export const updateTimetableEntry = async (req, res, next) => {
  try {
    const entry = await Timetable.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ message: "Timetable entry not found" });
    }

    // Verify ownership
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this entry" });
    }

    // Update fields
    Object.assign(entry, req.body);
    const updatedEntry = await entry.save();
    
    res.json(updatedEntry);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete timetable entry
// @route   DELETE /api/timetable/:id
// @access  Private
export const deleteTimetableEntry = async (req, res, next) => {
  try {
    const entry = await Timetable.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ message: "Timetable entry not found" });
    }

    // Verify ownership
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this entry" });
    }
    
    await entry.deleteOne();
    res.json({ message: "Timetable entry removed" });
  } catch (err) {
    // Handle invalid MongoDB ObjectId
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Timetable entry not found" });
    }
    next(err);
  }
};
