const multer = require("multer");

const Storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './Public')
    },

    filename: (req, file, callBack) => {
        callBack(null, file.originalname)
    }
})

const Upload = multer({ storage: Storage, limits: { fileSize: 5 * 1024 * 1024 } });
module.exports = Upload.single("resume");