const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        role: {
            type: String,
            trim: true,
        },

        companyName: {
            type: String,
            required: true,
            trim: true,
        },

        hrEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        emailContent: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["sent", "failed"],
            default: "sent",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
