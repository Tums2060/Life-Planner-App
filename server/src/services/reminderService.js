import cron from "node-cron";
import Reminder from "../models/Reminder.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Send a reminder email
const sendEmail = async (reminder) => {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: reminder.user.email,
        subject: "Life Planner Reminder",
        text: reminder.message,
    });
};

// Process reminders periodically
export const startReminderJob = () => {
    cron.schedule("*/1 * * * *", async () => {
        const now = new Date();
        const dueReminders = await Reminder.find({
            remindAt: { $lte: now },
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