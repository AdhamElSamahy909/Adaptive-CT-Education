const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const axiosInstance = require("../lib/axiosInstance");
dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const secret = process.env.SECRET;

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
      role: "student",
    });

    // const verificationToken = jwt.sign(
    //   { userId: user.id },
    //   process.env.JWT_VERIFICATION_SECRET,
    //   { expiresIn: "1d" },
    // );

    // console.log(
    //   "Verification Token sent for email verification: ",
    //   verificationToken,
    // );

    // await sendVerificationEmail(user, verificationToken);

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
      domain: ".adaptivecomputationalthinkingeducation.app",
      httpOnly: true,
      secure: true,
      sameSite: "none",
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
      domain: ".adaptivecomputationalthinkingeducation.app",
      httpOnly: true,
      secure: true,
      sameSite: "none",
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
    styleChange: req.user.styleChange,
  });
  return;
};

exports.logout = (req, res) => {
  res.clearCookie("accessToken", {
    domain: ".adaptivecomputationalthinkingeducation.app",
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

// exports.handOff = (req, res) => {
//   const ticket = crypto.randomBytes(32).toString("hex");

//   ticketStore.set(ticket, {
//     userId: req.user.id,
//     email: req.user.email,
//     expiresAt: Date.now() + TICKET_EXPIRATION_TIME,
//   });

//   return res.status(200).json({ ticket });
// };

// exports.redeemTicket = async (req, res) => {
//   const { ticket } = req.body;

//   if (!ticket) {
//     return res.status(400).json({ message: "Ticket is required" });
//   }

//   const ticketData = ticketStore.get(ticket);

//   if (!ticketData) {
//     return res.status(400).json({ message: "Invalid or expired ticket" });
//   }

//   ticketStore.delete(ticket);

//   if (Date.now() > ticketData.expiresAt) {
//     return res.status(401).json({ error: "Ticket has expired" });
//   }

//   const accessToken = jwt.sign(
//     { id: ticketData.userId, email: ticketData.email },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: "7d" },
//   );

//   res.cookie("accessToken", accessToken, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "none",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });

//   return res.json({ message: "Ticket redeemed successfully" });
// };

// setInterval(() => {
//   const now = Date.now();
//   for (const [ticket, data] of ticketStore.entries()) {
//     if (now > data.expiresAt) {
//       ticketStore.delete(ticket);
//     }
//   }
// }, 60 * 1000);
