const axiosInstance = require("../lib/axiosInstance");
const User = require("../models/user");

exports.coldStart = async (req, res) => {
  try {
    const { userId, challenge1Answer, challenge2Answer } = req.body;
    console.log("Received cold start challenge results:", {
      userId,
      challenge1Answer,
      challenge2Answer,
    });
    const visualScore = challenge1Answer === "A" ? "Pass" : "Fail";
    const verbalScore = challenge2Answer === "D" ? "Pass" : "Fail";

    const response = await axiosInstance.post("/cold-start", {
      user_id: userId,
      visual_score: visualScore,
      verbal_score: verbalScore,
    });

    console.log(
      "Cold start challenge results processed successfully:",
      response.data,
    );

    await User.findByIdAndUpdate(userId, {
      coldStartChallengeCompleted: true,
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while processing the cold start challenge results",
    });
  }
};

exports.inferLearningStyle = async (req, res) => {
  try {
    const { userId } = req.params;
    const user_id = userId;

    const response = await axiosInstance.get(
      `/infer-learning-style/${user_id}`,
    );

    console.log(
      "Learning style inference completed successfully:",
      response.data,
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while inferring the learning style",
    });
  }
};

exports.updateLearningStyle = async (req, res) => {
  try {
    const { userId, numOfBackClicks, numOfForwardClicks, currentMode } =
      req.body;

    console.log("Received learning style update data:", {
      userId,
      numOfBackClicks,
      numOfForwardClicks,
      currentMode,
    });
    const user_id = userId;
    let user = await User.findById(userId);
    let backClicksPercentage = (numOfBackClicks / numOfForwardClicks) * 100;
    let behavior_signal;

    if (currentMode === "Visual") {
      behavior_signal =
        backClicksPercentage > 45 ? "VerbalDominant" : "VisualDominant";
    } else {
      behavior_signal =
        backClicksPercentage > 45 ? "VisualDominant" : "VerbalDominant";
    }

    console.log("Data sent to python microservice for learning style update:", {
      user_id,
      behavior_signal,
    });

    const response = await axiosInstance.post(`/update-learning-style`, {
      user_id,
      behavior_signal,
    });

    await user.updateOne({
      lastPreferredLearningStyle:
        behavior_signal === "VisualDominant" ? "Visual" : "Verbal",
    });

    console.log("Learning style update completed successfully:", response.data);
    console.log("Learning style update completed successfully");

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while updating the learning style",
    });
  }
};
