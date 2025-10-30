import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const RegisterUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: 'Request body is missing' });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'Please provide all required fields: username, email, password'
        });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ username, email, password });

        if (user) {
            res.status(201).json({
                message: 'User created successfully',
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const LoginUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: 'Request body is missing' });
    }

    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
        return res.status(400).json({
            message: 'Please provide all required fields: username, email, password'
        });
    }

    try {
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername }
            ]
        }).select('+password');

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                message: 'Account not found. Please check your credentials or register.'
            });
        }

        // // Verify password if user exists
        // const isPasswordValid = await user.matchPassword(password);
        // if (!isPasswordValid) {
        //     return res.status(401).json({
        //         message: 'Invalid password'
        //     });
        // }

        // Success case
        res.json({
            message: 'User logged in successfully',
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const LogoutUser = async (req, res) => {
    // Invalidate token on client side by removing it
    res.json({ message: 'User logged out successfully' });
};