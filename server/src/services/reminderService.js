import cron from "node-cron";
import Reminder from "../models/Reminder.js";
import nodemailer from "nodemailer";

// Only create transporter if email credentials are provided
let transporter = null;
if (process.env.STMP_USER && process.env.STMP_PASS) {
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.STMP_USER,
            pass: process.env.STMP_PASS,
        },
    });
}

const sendEmail = async (reminder) => {
    if (!transporter) {
        console.log("Email not configured. Skipping email for reminder:", reminder.message);
        return;
    }
    await transporter.sendMail({
        from: process.env.STMP_USER,
        to: reminder.user.email, //aparently requires populated user
        subject: "Life Planner Reminder",
        text: reminder.message,
    });
}

export const startReminderJob = () => {
    cron.schedule("*/1 * * * *", async () => {
        const now = new Date();
        const dueReminders = await Reminder.find({
            remindAt: {$lte: now},
            isSent: false,

        }).populate("user");

        for (const reminder of dueReminders) {
            if (reminder.via === "email") {
                await sendEmail(reminder);
            }

            reminder.isSent = true;
            await reminder.save();
        }
    });
};