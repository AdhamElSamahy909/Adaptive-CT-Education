const mongoose = require("mongoose");

const blockedSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true,
  },
  forbiddenTexts: [
    {
      type: String,
      required: true,
    },
  ],
  otherFields: [
    {
      type: String,
      default: "",
    },
  ],
});

const Blocked = mongoose.model("BlockedIP", blockedSchema);

module.exports = Blocked;
