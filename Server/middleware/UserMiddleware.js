const jwt = require("jsonwebtoken");

const FindCurrentUser = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token ||
            req.headers["authorization"]?.replace("Bearer ", "") ||
            req.headers["Authorization"]?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found. Please log in again.",
            });
        }

        const verify = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verify.userId;
        next();
    }

    catch (err) {
        console.error("FindCurrentUser Error:", err.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

module.exports = FindCurrentUser;
