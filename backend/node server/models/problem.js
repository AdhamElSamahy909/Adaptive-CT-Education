const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  topic: {
    type: String,
    enum: ["loops", "conditonals", "sequential"],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
});

module.exports = problemSchema;
