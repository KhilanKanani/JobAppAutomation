const express = require("express");
const router = express.Router();
const { sendApplication, getUserApplications, trackEmail } = require("../controllers/appController");
const FindCurrentUser = require("../middleware/UserMiddleware");

router.post("/send", FindCurrentUser, sendApplication);
router.get("/history", FindCurrentUser, getUserApplications);
router.get("/open/:id", trackEmail);

module.exports = router;
