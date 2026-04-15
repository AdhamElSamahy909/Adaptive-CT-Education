const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  topic: {
    type: String,
    enum: ["loops", "conditionals", "sequential"],
    required: true,
  },
  starterCode: {
    type: String,
    required: true,
  },
  testCases: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
        required: true,
      },
    },
  ],
  wayToSolve: {
    verbal: [
      {
        type: String,
        required: true,
      },
    ],
    visual: [
      {
        text: {
          type: String,
          required: true,
        },
        shape: {
          type: String,
          enum: ["oval", "rectangle", "parallelogram", "diamond"],
          required: true,
        },
        directedTowards: [
          {
            direction: {
              type: String,
              enum: ["next", "yes", "no"],
              required: true,
            },
            requiredStep: {
              type: String,
              required: true,
              validate: {
                validator: async function (value) {
                  const doc = this.ownerDocument();
                  const visualTexts =
                    doc.wayToSolve?.visual?.map((v) => v.text) || [];
                  return visualTexts.includes(value);
                },
                message: (props) =>
                  `${props.value} is not a valid step text. Must match one of: ${getValidStepTexts(props.object.ownerDocument())}`,
              },
            },
          },
        ],
      },
    ],
  },
});

function getValidStepTexts(doc) {
  const texts = doc.wayToSolve?.visual?.map((v) => v.text) || [];
  return texts.join(", ");
}

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;

// generate another 9 sequential exercises, 3 for each level: easy, medium, and hard
