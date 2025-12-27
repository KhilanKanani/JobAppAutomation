const User = require("../models/usermodel");
const generateToken = require("../config/generateToken");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const user = await User.create({ name, email, password, });

        const token = await generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
            path: '/'
        });

        res.status(201).json({
            message: "Signup successful",
            user
        });
    }

    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || password != user?.password) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = await generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
            path: '/'
        });

        res.status(200).json({
            message: "Login successful",
            user
        });
    }

    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            message: "Logout successful"
        });
    }

    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { signup, login, logout, };
