const Application = require("../models/applicationmodel");
const nodemailer = require("nodemailer");
const generateJobEmail = require("../config/gptEmailGenerator");

const sendApplication = async (req, res) => {
    try {
        const userId = req.userId;
        const { fullName, email, role, companyName, hrEmail, resumeUrl, } = req.body;

        /*  GPT EMAIL  */
        const emailContent = await generateJobEmail({ fullName, email, role, companyName, resumeUrl, });

        /*  MAIL SETUP  */
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.verify();
        console.log("Email Verified");

        const mailOptions = {
            from: `"${fullName}" <${process.env.MAIL_USER}>`,
            replyTo: email,
            to: hrEmail,
            subject: role ? `Interest in ${role} Position at ${companyName}` : `Seeking Internship Opportunity at ${companyName}`,
            html: emailContent.trim().replace(/\n/g, "<br/>"),
        };

        /*  SAVE HISTORY  */
        const application = await Application.create({ userId, fullName, email, role, companyName, hrEmail, resumeUrl, emailContent: emailContent.trim(), status: "sent", });
        
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "Application sent successfully",
            application,
        });

    }

    catch (err) {
        console.error("SendApplication Error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Failed to send application",
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

        const applications = await Application.find({ userId }).sort({ createdAt: -1 });

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

module.exports = { sendApplication, getUserApplications };
