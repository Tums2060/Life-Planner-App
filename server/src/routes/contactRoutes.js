import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post("/", async (req, res) => {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) 
        return res.status(400).json({ message: "All fields are required" });

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Life Planner" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "We received your message!",
            html: ` 
            <h3>Hi ${firstName} ${lastName},</h3>
            <p>Thank you for contacting <strong>Life Planner</strong>! We have received your message and will get back to you within 24 hours.</p>
            <p><strong>Your Message:</strong> ${message}</p>
            <p>Best regards,<br/>The Life Planner Team</p>
            `,
        });

        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({
            message: "There was an error sending your message. Please try again later.",
        });
        }
    });

export default router;