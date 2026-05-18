const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["pretest", "posttest"],
    required: true,
  },
  questions: [
    {
      part: {
        type: String,
        enum: ["Loops", "Conditionals", "Sequential"],
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      question: {
        type: String,
        required: true,
      },
      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
      },
      options: [
        {
          type: String,
          required: true,
        },
      ],
      correctAnswer: {
        type: String,
        required: true,
      },
    },
  ],
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
