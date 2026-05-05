const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "please provide your first name"],
    },
    lastName: {
      type: String,
      required: [true, "please provide your last name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "please provide your email"],
    },
    password: {
      type: String,
      required: [true, "please provide a password"],
      minlength: 5,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "instructor"],
      required: [true, "please specify your role"],
    },
    passwordConfirm: {
      type: String,
      required: [
        function () {
          return this.isNew || this.isModified("password");
        },
        "please confirm your password",
      ],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "passwords are not the same",
      },
    },
    coldStartChallengeCompleted: {
      type: Boolean,
      default: false,
    },
    lastPreferredLearningStyle: {
      type: String,
      enum: ["Visual", "Verbal", "Unknown"],
      default: "Unknown",
    },
    styleChange: {
      isDetected: { type: Boolean, default: false },
      isChanged: { type: Boolean, default: false },
    },
    problemsSolved: [String],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
