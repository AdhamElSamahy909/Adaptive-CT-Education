const TestResults = require("../models/testResults");

exports.submitTestResults = async (req, res) => {
  try {
    const { userId, testId, answers } = req.body;

    console.log("Received test results:", { userId, testId, answers });

    if (!userId || !testId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message:
          "Missing or invalid required fields: userId, testId, and answers array.",
      });
    }

    const existingResult = await TestResults.findOne({ userId, testId });
    if (existingResult) {
      return res.status(400).json({
        message: "Test results for this user already exist.",
      });
    }

    const testResult = await TestResults.create({
      userId,
      testId,
      answers,
    });

    res.status(201).json(testResult);
  } catch (error) {
    console.error("Error saving test results:", error);
    res.status(500).json({ error: "Server error saving test results." });
  }
};
