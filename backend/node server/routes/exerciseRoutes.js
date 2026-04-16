const express = require("express");
const exerciseController = require("../controllers/exerciseController");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Exercise = require("../models/exercise");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const router = express.Router();

router.get("/", exerciseController.getAllExercises);
router.post("/", exerciseController.createExercises);
router.delete("/:id", exerciseController.deleteExercise);
router.patch("/:id", exerciseController.updateExercise);
router.get("/topic/:topicName", exerciseController.getExercisesByTopic);
router.post("/execute", exerciseController.executeExercise);
router.post("/detect-struggling", exerciseController.detectStruggling);
router.get("/10-random", exerciseController.get10RandomExercises);

router.post("/update-starter-code-form", async (req, res) => {
  try {
    const exercises = await Exercise.find().lean();

    const exercisesData = exercises.map((exercise) => ({
      id: exercise._id,
      title: exercise.title,
      description: exercise.description,
      starterCode: exercise.starterCode,
    }));

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `You are an assistant for updating starter code for coding exercises. You will be given a list of exercises with their current starter code. For each exercise, analyze the title and description, and update the starter code to be in python syntax. If the starter code is already in python code, leave it as it is. Here is the list of exercises:\n\n${JSON.stringify(exercisesData)}\n\nReturn a JSON array with the following format: [{id: exerciseId, updatedStarterCode: "the updated starter code"}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Received response from Gemini API: ", text);

    const updates = JSON.parse(text);
    res.json({ updates });
  } catch (error) {
    console.log("Error in /update-starter-code-form route: ", error);
    return res
      .status(500)
      .json({ error: "Failed to update starter code form" });
  }
});

module.exports = router;
