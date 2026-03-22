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
    learningStyleBayesianNetwork: {
      createdAt: Date,
      lastUpdated: Date,
      status: {
        type: String,
        enum: ["initialized", "in-progress", "completed"],
        default: "initialized",
      },
      structure: Object,
      parameters: Object,
      evidence: Object,
      inferences: [Object],
    },
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

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
