

import Habit from "../models/Habit.js";

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
export const createHabit = async (req, res, next) => {
  try {
    const habit = await Habit.create({
      user: req.user._id,
      ...req.body,
    });
    res.status(201).json(habit);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all habits for logged-in user
// @route   GET /api/habits
// @access  Private
export const getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isArchived: false }).sort({
      createdAt: -1,
    });
    res.json(habits);
  } catch (err) {
    next(err);
  }
};

// @desc    Mark habit as complete
// @route   PATCH /api/habits/:id/complete
// @access  Private
export const completeHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();
    const last = habit.lastCompleted ? new Date(habit.lastCompleted) : null;

    const isSameDay =
      last &&
      last.getUTCFullYear() === today.getUTCFullYear() &&
      last.getUTCMonth() === today.getUTCMonth() &&
      last.getUTCDate() === today.getUTCDate();

    if (!isSameDay) {
      // Check if yesterday was last completed to maintain streak
      const yesterday = new Date(today);
      yesterday.setUTCDate(today.getUTCDate() - 1);

      const isYesterday =
        last &&
        last.getUTCFullYear() === yesterday.getUTCFullYear() &&
        last.getUTCMonth() === yesterday.getUTCMonth() &&
        last.getUTCDate() === yesterday.getUTCDate();

      habit.currentStreak = isYesterday ? habit.currentStreak + 1 : 1;
      if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
      }
      habit.lastCompleted = today;
      await habit.save();
    }

    res.json(habit);
  } catch (err) {
    next(err);
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
export const updateHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" });
    }
    Object.assign(habit, req.body);
    const updated = await habit.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Archive habit
// @route   PATCH /api/habits/:id/archive
// @access  Private
export const archiveHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" });
    }
    habit.isArchived = true;
    await habit.save();
    res.json({ message: "Habit archived" });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
export const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" });
    }
    await habit.deleteOne();
    res.json({ message: "Habit removed" });
  } catch (err) {
    next(err);
  }
};