const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axiosInstance = require("../lib/axiosInstance");

exports.signup = async (req, res, next) => {
  try {
    console.log("Req.body: ", req.body);
    const { firstName, lastName, email, password, passwordConfirm, role } =
      req.body;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
      role: role,
    });

    if (role === "student") {
      const difficultyNetworkResponse = await axiosInstance.post(
        "/initialize-difficulty-network",
        {
          user_id: user._id.toString(),
        },
      );

      console.log(
        "Difficulty network initialized successfully: ",
        difficultyNetworkResponse.data,
      );
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    req.user = user;

    return res.status(200).json({ message: "Successful Signup" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error happened during signup" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(400).json({ message: "This email is not found" });

    console.log("User found for login: ", user.password); // Debugging statement

    const match = await bcrypt.compare(password, user.password.toString());

    console.log("Password match result: ", match); // Debugging statement

    if (!match)
      return res.status(400).json({ message: "Entered password is invalid" });

    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    req.user = user;

    console.log("User logged in successfully: ", user); // Debugging statement
    return res.status(200).json({ message: "Successful Login" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error happened during login" });
  }
};

exports.verifyJWT = async (req, res, next) => {
  let token;

  if (req.cookies.accessToken) token = req.cookies.accessToken;

  if (!token) return res.status(400).json({ message: "No Token" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (next && typeof next === "function") {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res
          .status(400)
          .json({ message: "Authentication Failed. User not found" });
      }
      req.user = user;
      return next();
    }
  } catch (error) {
    return res.status(400).json({ message: "Authentication Failed. Login" });
  }
};

exports.checkSessionStatus = (req, res) => {
  res.status(200).json({
    message: "Authenticated",
    coldStartChallengeCompleted: req.user.coldStartChallengeCompleted,
    id: req.user.id,
    lastPreferredLearningStyle: req.user.lastPreferredLearningStyle,
    solvedProblems: req.user.problemsSolved,
    role: req.user.role,
  });
  return;
};

exports.logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
