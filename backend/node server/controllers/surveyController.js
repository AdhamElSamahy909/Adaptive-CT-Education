const Survey = require("../models/survey");

exports.getSurvey = async (req, res) => {
  try {
    const survey = await Survey.findOne();
    if (!survey) {
      return res
        .status(404)
        .json({ status: "fail", message: "Survey not found" });
    }
    res.status(200).json({ status: "success", survey });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.createSurvey = async (req, res) => {
  try {
    const newSurvey = await Survey.create(req.body);
    res.status(201).json({ status: "success", data: { survey: newSurvey } });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};
