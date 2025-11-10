import Timetable from "../models/Timetable.js";

// @desc Create new timetable entry
// @route POST /api/timetable
// @access Private
export const createEntry = async (req , res , next) => {
    try {
        const { title, day, time, type} = req.body;

        if (!title || !day || !time) {
            return res.status(400).json({ message: "Title, day, and time are required" });
        }

        const entry = await Timetable.create({
            user:req.user._id,
            title,
            day,
            time,
            type,
        });

        res.status(201).json(entry);
    } catch (err) {
        next(err);
    }
};

// @desc Get all entries for logged-in user
// @route GET /api/timetable
// @access Private
export const getEntries = async (req , res, next) => {
    try{
        const entries = await Timetable.find({ user: req.user._id }).sort({ day: 1, time: 1 });
        res.json(entries);
    } catch (err){
        next(err);
    }
};

// @desc GET single entry
// @route GET /api/timetable/:id
// @access Private
export const getEntryById = async (req , res, next) => {
    try{
        const entry = await Timetable.findById(req.params.id);
        if (!entry || entry.user.toString() !== req.user._id.toString()){
            return res.status(404).json({ message: "Entry not found" });
        }
        res.json(entry);
    } catch (err){
        next(err);
    }
};

// @desc Update entry
// @route PUT /api/timetable/:id
// @access Private
export const updateEntry = async (req , res, next) => {
    try{
        const entry = await Timetable.findById(req.params.id);
        if (!entry || entry.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Entry not found"});
        }

        Object.assign(entry, req.body);
        const updated = await entry.save();
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// @desc Delete entry
// @route DELETE /api/timetable/:id
// @access Private
export const deleteEntry = async (req , res, next) => {
    try {
        const entry = await Timetable.findById(req.params.id);
        if (!entry || entry.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Entry not found" });
        }
        await entry.deleteOne();
        res.json({ message: "Entry removed" });
    } catch (err) {
        next(err);
    }
};