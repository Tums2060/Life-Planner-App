import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: { type: String, required: true},
        date: { type: Date, required: true},
        time: { type: String, required: true},
        type : { type: String, enum: ["Study", "Personal", "Class"], default: "Personal"}
    },
    { timestamps: true }
);

export default mongoose.model("Timetable", timetableSchema);