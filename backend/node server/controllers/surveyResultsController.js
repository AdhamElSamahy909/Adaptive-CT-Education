const SurveyResults = require("../models/surveyResults");

exports.getAllSurveyResults = async (req, res) => {
  try {
    const surveyResults = await SurveyResults.find().populate("userId");
    res.status(200).json({ status: "success", data: { surveyResults } });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.submitSurveyResults = async (req, res) => {
  try {
    const { userId, answers } = req.body;

    console.log("Received survey results:", { userId, answers });

    if (!userId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message:
          "Missing or invalid required fields: userId and answers array.",
      });
    }

    const surveyResult = await SurveyResults.create({
      userId,
      answers,
    });

    res.status(201).json(surveyResult);
  } catch (error) {
    console.error("Error saving survey results:", error);
    res.status(500).json({ error: "Server error saving survey results." });
  }
};
