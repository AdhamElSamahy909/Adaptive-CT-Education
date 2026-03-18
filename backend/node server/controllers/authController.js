const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res, next) => {
  try {
    console.log("Req.body: ", req.body);
    const { firstName, lastName, email, password, passwordConfirm } = req.body;

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
    });

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

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "This email is not found" });

    const match = await bcrypt.compare(password, user.password);

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

    return res.status(200).json({ message: "Successful Login" });
  } catch (error) {
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
      req.user = { user };
      return next();
    }
  } catch (error) {
    return res.status(400).json({ message: "Authentication Failed. Login" });
  }
};

exports.checkSessionStatus = (req, res) => {
  res
    .status(200)
    .json({
      message: "Authenticated",
      coldStartChallengeCompleted: req.user.user.coldStartChallengeCompleted,
    });
  return;
};
