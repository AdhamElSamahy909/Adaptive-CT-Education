const mongoose = require("mongoose");

const testResultsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  answers: [
    {
      questionTitle: {
        type: String,
        required: true,
      },
      selectedOption: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

const TestResults = mongoose.model("TestResults", testResultsSchema);

module.exports = TestResults;
