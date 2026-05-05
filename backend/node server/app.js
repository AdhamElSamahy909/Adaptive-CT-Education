const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const bayesianNetworkRoutes = require("./routes/bayesianNetworkRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const lectureRoutes = require("./routes/lectureRoutes");
const cors = require("cors");
const axiosInstance = require("./lib/axiosInstance");
const User = require("./models/user");
const Exercise = require("./models/exercise");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:8000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "250kb" }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bayesian-networks", bayesianNetworkRoutes);
app.use("/api/v1/exercises", exerciseRoutes);
app.use("/api/v1/lectures", lectureRoutes);

module.exports = app;
