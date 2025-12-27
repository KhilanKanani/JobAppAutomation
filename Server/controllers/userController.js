const Cloudinary = require("../config/cloudinary");
const UserModel = require("../models/usermodel");

const EditProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name } = req.body;

        let updateData = { name };

        if (req.file) {
            const uploadResult = await Cloudinary(req.file.path);
            updateData.resumeUrl = uploadResult;
        }

        const user = await UserModel.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });

    }

    catch (err) {
        console.log("EditProfile Error:", err.message);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


const GetCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await UserModel.findById({ _id: userId }).select("-password");

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User Not Found..."
            });
        }

        return res.status(200).json({
            success: true,
            user: user
        });
    }

    catch (err) {
        console.log("GetCurrentUser Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = { EditProfile, GetCurrentUser };