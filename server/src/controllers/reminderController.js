import Reminder from "../models/Reminder";

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