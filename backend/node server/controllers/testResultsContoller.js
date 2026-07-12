const TestResults = require("../models/testResults");
const ids = require("../utils/ids").ids;
const pretestId = require("../utils/ids").pretestId;
const posttestId = require("../utils/ids").posttestId;

exports.getTestResults = async (req, res) => {
  try {
    const results = await TestResults.find({
      userId: { $in: ids },
      testId: { $in: [pretestId, posttestId] },
    });

    const resultsSummary = ids.map((userId) => {
      const userPretest = results.find(
        (r) =>
          r.userId.toString() === userId && r.testId.toString() === pretestId
      );
      const userPosttest = results.find(
        (r) =>
          r.userId.toString() === userId && r.testId.toString() === posttestId
      );

      const pretestScore = userPretest
        ? userPretest.answers.filter((ans) => ans.isCorrect).length
        : 0;
      const posttestScore = userPosttest
        ? userPosttest.answers.filter((ans) => ans.isCorrect).length
        : 0;

      const average = (pretestScore + posttestScore) / 2;

      return {
        userId,
        pretestScore,
        posttestScore,
        average,
      };
    });

    res.status(200).json(resultsSummary);
  } catch (error) {
    console.error("Error calculating test results:", error);
    res.status(500).json({ error: "Server error calculating test results." });
  }
};

// exports.submitTestResults = async (req, res) => {
//   try {
//     const { userId, testId, answers } = req.body;

//     console.log("Received test results:", { userId, testId, answers });

//     if (!userId || !testId || !answers || !Array.isArray(answers)) {
//       return res.status(400).json({
//         message:
//           "Missing or invalid required fields: userId, testId, and answers array.",
//       });
//     }

//     const existingResult = await TestResults.findOne({ userId, testId });
//     if (existingResult) {
//       return res.status(400).json({
//         message: "Test results for this user already exist.",
//       });
//     }

//     const testResult = await TestResults.create({
//       userId,
//       testId,
//       answers,
//     });

//     res.status(201).json(testResult);
//   } catch (error) {
//     console.error("Error saving test results:", error);
//     res.status(500).json({ error: "Server error saving test results." });
//   }
// };
