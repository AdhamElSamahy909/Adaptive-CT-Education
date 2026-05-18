const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema({
  questions: [
    {
      title: { type: String, required: false },
      part: { type: String, required: true },
      question: { type: String, required: true },
      scaleQuestion: { type: Boolean, default: false },
      openEnded: { type: Boolean, default: false },
      multipleAnswer: { type: Boolean, default: false },
      options: [{ type: String, required: true }],
    },
  ],
});

const Survey = mongoose.model("Survey", surveySchema);

module.exports = Survey;
