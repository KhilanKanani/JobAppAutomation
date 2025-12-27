const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const Cloudinary = async (filePath) => {
    // Configure
    cloudinary.config({
        cloud_name: `${process.env.CLOUD_NAME}`,
        api_key: `${process.env.CLOUD_API_KEY}`,
        api_secret: `${process.env.CLOUD_API_SECRET}`
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: "resumes",
            resource_type: "auto",
            format: "pdf",
        });
        fs.unlinkSync(filePath);
        return uploadResult.secure_url;
    }

    catch (err) {
        console.log("UploadCloudinary Error :", err.message);
        if (fs.existsSync(filePath))
            fs.unlinkSync(filePath);
    }
}

module.exports = Cloudinary