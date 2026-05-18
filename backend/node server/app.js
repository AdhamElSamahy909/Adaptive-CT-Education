const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const bayesianNetworkRoutes = require("./routes/bayesianNetworkRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const lectureRoutes = require("./routes/lectureRoutes");
const testRoutes = require("./routes/testRoutes");
const surveyRoutes = require("./routes/surveyRoutes");
const testResultsRoutes = require("./routes/testResultsRoutes");
const surveyResultsRoutes = require("./routes/surveyResultsRoutes");
const cors = require("cors");
const axiosInstance = require("./lib/axiosInstance");
const User = require("./models/user");
const Exercise = require("./models/exercise");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = express();

console.log("FASTAPI_SERVER_URL:", process.env.FASTAPI_SERVER_URL);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://127.0.0.1:8000",
      "https://4f78806c.adaptive-ct-education.pages.dev",
      "https://adaptive-ct-education.pages.dev",
      "https://adaptive-ct-education-testing-phase.pages.dev",
      "https://adaptive-ct-education-postest.pages.dev",
      process.env.FASTAPI_SERVER_URL,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// app.use(mongoSanitize());
// app.use(hpp());

app.set("trust proxy", 1);

app.use(express.json({ limit: "250kb" }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bayesian-networks", bayesianNetworkRoutes);
app.use("/api/v1/exercises", exerciseRoutes);
app.use("/api/v1/lectures", lectureRoutes);
app.use("/api/v1/tests", testRoutes);
app.use("/api/v1/test-results", testResultsRoutes);
app.use("/api/v1/survey", surveyRoutes);
app.use("/api/v1/survey-results", surveyResultsRoutes);

module.exports = app;
