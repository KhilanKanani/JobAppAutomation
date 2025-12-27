const express = require("express");
const { EditProfile, GetCurrentUser } = require("../controllers/UserController");
const FindCurrentUser = require("../middleware/UserMiddleware");
const Upload = require('../middleware/multer');
const router = express.Router();

router.get("/currentUser", FindCurrentUser, GetCurrentUser);
router.put("/editProfile", FindCurrentUser, Upload, EditProfile);

module.exports = router;