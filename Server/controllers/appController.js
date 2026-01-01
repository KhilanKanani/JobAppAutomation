const Application = require("../models/applicationmodel");
const generateJobEmail = require("../config/gptEmailGenerator");

const sendApplication = async (req, res) => {
    try {
        const userId = req.userId;
        const { fullName, email, role, companyName, hrEmail, resumeUrl, } = req.body;

        const exists = await Application.findOne({ userId, role, companyName, hrEmail, });

        if (exists) {
            return res.status(409).json({
                success: false,
                message: "Application already sent to this HR",
            });
        }

        /*  GPT EMAIL  */
        const emailContent = await generateJobEmail({ fullName, email, role, companyName, resumeUrl, });

        // Generate dynamic subject line
        const subjectLines = role
            ? [
                `Application for ${role} Position at ${companyName}`,
                `Interested in ${role} Role - ${fullName}`,
                `${role} Position Application - ${fullName}`,
                `Application: ${role} at ${companyName}`
            ]
            : [
                `Seeking Opportunity at ${companyName} - ${fullName}`,
                `Application for Position at ${companyName}`,
                `Interest in Joining ${companyName} - ${fullName}`,
                `Career Opportunity Inquiry - ${fullName}`
            ];

        const subject = subjectLines[Math.floor(Math.random() * subjectLines.length)];

        const plainText = emailContent
            .replace(/<\/p>/gi, "\n")
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<[^>]*>/g, "")
            .trim();

        /*  SAVE HISTORY  */
        const application = await Application.create({ userId, fullName, email, role, companyName, hrEmail, resumeUrl, emailContent: plainText, status: "sent", });

        return res.status(200).json({
            success: true,
            message: "Application sent successfully",
            application,
            plainText,
            subject
        });
    }

    catch (err) {
        console.error("SEND APPLICATION ERROR FULL:", err);

        return res.status(500).json({
            success: false,
            message: err.message,
            stack: err.stack,
        });
    }

};

const getUserApplications = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const applications = await Application.find({ userId })
            .select('companyName role hrEmail createdAt status emailContent _id')
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for better performance (returns plain JS objects)

        return res.status(200).json({
            success: true,
            applications,
        });

    }

    catch (err) {
        console.error("GetApplicationHistory Error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch application history",
        });
    }
};

const trackEmail = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        console.log(application)

        if (application && !application.open) {
            application.open = true;
            application.openAt = new Date();
            await application.save();
        }

        // 1x1 transparent pixel
        const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=", "base64");
        res.set("Content-Type", "image/png");
        res.set("Cache-Control", "no-cache, no-store, must-revalidate");
        res.send(pixel);
    }

    catch (err) {
        res.status(200).end();
    }
};



module.exports = { sendApplication, getUserApplications, trackEmail };
