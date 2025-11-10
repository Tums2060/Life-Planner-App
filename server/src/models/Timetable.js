import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            trim: true,
        },
        isRecurring: {
            type: Boolean,
            default: false,
        },
        repeatPattern: {
            type: String,
            enum: ["daily", "weekly", "monthly", "none"],
            default: "none",
        },
    },
    {timestamps: true}
);

// Validation: startTime must be before endTime
timetableSchema.pre('save', function(next) {
    if (this.startTime >= this.endTime) {
        next(new Error('Start time must be before end time'));
    }
    next();
});

export default mongoose.model("Timetable", timetableSchema);
