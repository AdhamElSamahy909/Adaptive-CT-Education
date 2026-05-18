const SurveyResults = require("../models/surveyResults");

exports.getAllSurveyResults = async (req, res) => {
  try {
    const surveyResults = await SurveyResults.find().populate("userId");
    res.status(200).json({ status: "success", data: { surveyResults } });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.createSurveyResult = async (req, res) => {
  try {
    const newSurveyResult = await SurveyResults.create(req.body);
    res
      .status(201)
      .json({ status: "success", data: { surveyResult: newSurveyResult } });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};
