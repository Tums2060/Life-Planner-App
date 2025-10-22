import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            reuqired: true,
        },
        type: {
            type: String,
            enum: ["timetable", "goal", "Habit", "Custom"],
            required: true,
        },
        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "type",
        },
        message: {type: String, required: true},
        remindAt: {type: Date, required: true},
        isSent: {type: Boolean, default: false},
        via: {
            type: String,
            enum: ["email", "push"],
            default: "email",
        },
    },
    {timestamps: true}
);

export default mongoose.model("Reminder", reminderSchema);