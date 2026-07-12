const SurveyResults = require("../models/surveyResults");
const ids = require("../utils/ids").ids;

exports.getAllSurveyResults = async (req, res) => {
  try {
    const allResults = [];

    // Iterate over each ID from the ids list
    for (const id of ids) {
      // Find all records for the current userId to handle potential multiple entries
      const surveyRecords = await SurveyResults.find({ userId: id });

      if (surveyRecords.length > 0) {
        // Iterate over each record found for the current id
        surveyRecords.forEach((record) => {
          const formattedAnswers = record.answers.map((ans) => ({
            title: ans.questionTitle,
            answer:
              ans.selectedOptions && ans.selectedOptions.length > 0
                ? ans.selectedOptions
                : ans.openEndedAnswer,
          }));

          allResults.push({
            userId: id,
            recordId: record._id,
            surveyResults: formattedAnswers,
          });
        });
      } else {
        // Handle cases where no record is found for an id if needed
        allResults.push({
          userId: id,
          message: "No survey records found",
          surveyResults: [],
        });
      }
    }

    res.status(200).json(allResults);
  } catch (error) {
    console.error("Error in getAllSurveyResults:", error);
    res.status(500).json({
      error: "An error occurred while fetching survey results.",
    });
  }
};

exports.getSurveyResultsStats = async (req, res) => {
  try {
    // Fetch all survey records for the given user IDs
    const surveyRecords = await SurveyResults.find({ userId: { $in: ids } });

    const statsMap = {};
    const openEndedMap = {};

    surveyRecords.forEach((record) => {
      record.answers.forEach((ans) => {
        const title = ans.questionTitle;

        // Separate multiple-choice and open-ended questions
        if (ans.selectedOptions && ans.selectedOptions.length > 0) {
          // Multiple-choice question
          if (!statsMap[title]) {
            statsMap[title] = {
              totalRespondents: 0,
              optionData: {},
            };
          }

          statsMap[title].totalRespondents += 1;

          ans.selectedOptions.forEach((option) => {
            if (!statsMap[title].optionData[option]) {
              statsMap[title].optionData[option] = {
                count: 0,
                userIds: [],
              };
            }
            statsMap[title].optionData[option].count += 1;
            statsMap[title].optionData[option].userIds.push(
              record.userId.toString(),
            );
          });
        } else if (ans.openEndedAnswer && ans.openEndedAnswer.trim()) {
          // Open-ended question
          if (!openEndedMap[title]) {
            openEndedMap[title] = [];
          }

          openEndedMap[title].push({
            userId: record.userId.toString(),
            answer: ans.openEndedAnswer,
          });
        }
      });
    });

    // Convert the stats map into an array with percentages
    const multipleChoiceStats = Object.keys(statsMap).map((questionTitle) => {
      const data = statsMap[questionTitle];
      const choices = Object.keys(data.optionData).map((option) => {
        const optionInfo = data.optionData[option];
        const count = optionInfo.count;
        const percentage = ((count / data.totalRespondents) * 100).toFixed(2);

        return {
          choice: option,
          count: count,
          percentage: `${percentage}%`,
          userIds: optionInfo.userIds,
        };
      });

      return {
        questionTitle,
        totalResponses: data.totalRespondents,
        choices: choices,
      };
    });

    // Convert open-ended responses
    const openEndedResponses = Object.keys(openEndedMap).map(
      (questionTitle) => ({
        questionTitle,
        responses: openEndedMap[questionTitle],
      }),
    );

    res.status(200).json({
      multipleChoiceStats,
      openEndedResponses,
    });
  } catch (error) {
    console.error("Error in getSurveyResultsStats:", error);
    res
      .status(500)
      .json({ error: "Server error calculating survey statistics." });
  }
};

// exports.submitSurveyResults = async (req, res) => {
//   try {
//     const { userId, answers } = req.body;

//     console.log("Received survey results:", { userId, answers });

//     if (!userId || !answers || !Array.isArray(answers)) {
//       return res.status(400).json({
//         message:
//           "Missing or invalid required fields: userId and answers array.",
//       });
//     }

//     const surveyResult = await SurveyResults.create({
//       userId,
//       answers,
//     });

//     res.status(201).json(surveyResult);
//   } catch (error) {
//     console.error("Error saving survey results:", error);
//     res.status(500).json({ error: "Server error saving survey results." });
//   }
// };
