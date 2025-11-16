import Goal from "../models/Goal.js";

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res, next) => {
  try {
    const { title, progress = 0 } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const goal = await Goal.create({
      user: req.user._id,
      title: title.trim(),
      progress,
      isCompleted: false,
    });

    res.status(201).json(goal);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all goals for a user
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(goals);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
export const getGoalById = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal || goal.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json(goal);
  } catch (err) {
    next(err);
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal || goal.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const { title, progress, isCompleted } = req.body;

    if (title !== undefined) goal.title = title.trim();
    if (progress !== undefined) goal.progress = Math.min(Math.max(progress, 0), 100);
    if (isCompleted !== undefined) goal.isCompleted = isCompleted;

    const updated = await goal.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal || goal.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Goal not found" });
    }

    await goal.deleteOne();
    res.json({ message: "Goal deleted successfully" });
  } catch (err) {
    next(err);
  }
};
