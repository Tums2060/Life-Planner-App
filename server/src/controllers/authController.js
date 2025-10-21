import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => 
    jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});

export const registerUser = async (req , res , next) => {
    try{
        const {name, email, password} = req.body;

        const userExists = await User.findOne({email});
        if (userExists) return res.status(400).json({message: "User already exists"});

        const user = await User.create({name, email, password});

        res.status(201).json({
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            tocken: generateToken(user._id),
        });

    }
    catch (err) {
        next(err);
    }
}

export const loginUser = async (req , res , next) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({message: "Invalid email or password"});
        }
    } catch (err) {
        next(err);
    }
};

export const logoutUser = (req , res) => {
    res.json({message: "Logout handled on client (delete token)"});
};