import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            return next();
        } catch (err) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    res.status(401).json({ message: "Not authorized, no token" });
};


/**
 * @fileoverview Authentication Middleware
 * @description Handles request authentication and authorization
 *
 * @module AuthMiddleware
 */

/**
 * Authenticates incoming requests
 * Verifies and validates authentication tokens
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void}
 * @throws {Error} If authentication fails
 */