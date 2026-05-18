const mongoose = require("mongoose");

const surveyResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [
    {
      questionTitle: { type: String, required: false },
      selectedOptions: [{ type: String, required: true }],
      openEndedAnswer: { type: String, required: false },
    },
  ],
});

const SurveyResults = mongoose.model("SurveyResults", surveyResultSchema);

module.exports = SurveyResults;
