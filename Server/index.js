const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
dotenv.config();

const PORT = process.env.PORT;

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true, }));
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/UserRoutes");
const appRoutes = require("./routes/appRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/app", appRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`🚀 Server running on port ${PORT}`)
});