import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: { type: String, required: true},
        day: { type: String, required: true},
        time: { type: String, required: true},
        type : { type: String, enum: ["Study", "Personal", "Class"], default: "Personal"}
    }
);

export default mongoose.model("Timetable", timetableSchema);