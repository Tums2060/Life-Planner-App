import Habit from "../models/Habit.js";

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
export const createHabit = async (req, res, next) => {
  try {
    const { title, description = "", frequency = "daily" } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const habit = await Habit.create({
      user: req.user._id,
      title: title.trim(),
      description,
      frequency,
      currentStreak: 0,
      longestStreak: 0,
      lastCompleted: null,
      isArchived: false,
    });

    res.status(201).json(habit);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all habits for logged-in user (non-archived)
// @route   GET /api/habits
// @access  Private
export const getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({
      user: req.user._id,
      isArchived: false,
    }).sort({ createdAt: -1 });

    res.json(habits);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single habit
// @route   GET /api/habits/:id
// @access  Private
export const getHabitById = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json(habit);
  } catch (err) {
    next(err);
  }
};

// @desc    Mark habit as complete (updates streak if not completed today)
// @route   PATCH /api/habits/:id/complete
// @access  Private
export const completeHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCompleted = habit.lastCompleted
      ? new Date(habit.lastCompleted)
      : null;
    if (lastCompleted) {
      lastCompleted.setHours(0, 0, 0, 0);
    }

    // Check if already completed today
    const isSameDay = lastCompleted && lastCompleted.getTime() === today.getTime();

    if (!isSameDay) {
      // Check if yesterday was last completed (to maintain streak)
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const isYesterday =
        lastCompleted && lastCompleted.getTime() === yesterday.getTime();

      // Update streak
      if (isYesterday) {
        habit.currentStreak += 1;
      } else {
        habit.currentStreak = 1;
      }

      // Update longest streak if necessary
      if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
      }

      // Update last completed to today
      habit.lastCompleted = new Date();
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

    const { title, description, frequency } = req.body;

    if (title !== undefined) habit.title = title.trim();
    if (description !== undefined) habit.description = description;
    if (frequency !== undefined && ["daily", "weekly"].includes(frequency)) {
      habit.frequency = frequency;
    }

    const updated = await habit.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Archive habit (soft delete)
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
    res.json({ message: "Habit archived successfully" });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete habit (hard delete)
// @route   DELETE /api/habits/:id
// @access  Private
export const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" });
    }

    await habit.deleteOne();
    res.json({ message: "Habit deleted successfully" });
  } catch (err) {
    next(err);
  }
};
