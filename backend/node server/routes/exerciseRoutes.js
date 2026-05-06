const express = require("express");
const exerciseController = require("../controllers/exerciseController");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Exercise = require("../models/exercise");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

console.log("Directory:", __dirname);

const result = dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (result.error) {
  console.log("🚨 dotenv error:", result.error.message);
} else {
  console.log(
    "✅ dotenv loaded file from:",
    path.resolve(__dirname, "../.env"),
  );
  console.log(
    "🔑 Key loaded by dotenv starts with:",
    result.parsed.GEMINI_API_KEY?.substring(0, 8),
  );
  console.log(
    "🌍 Key ACTUALLY in process.env starts with:",
    process.env.GEMINI_API_KEY?.substring(0, 8),
  );
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log("GEMINI_API_KEY in exerciseRoutes: ", process.env.GEMINI_API_KEY);

const router = express.Router();

router.get("/", exerciseController.getAllExercises);
router.post("/", exerciseController.createExercises);
router.delete("/:id", exerciseController.deleteExercise);
router.patch("/:id", exerciseController.updateExercise);

router.get("/topic/:topicName", exerciseController.getExercisesByTopic);
router.post("/execute", exerciseController.executeExercise);
router.post("/detect-struggling", exerciseController.detectStruggling);
// router.get("/10-random", exerciseController.get10RandomExercises);

module.exports = router;
