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
    const {
      userId,
      numOfBackClicks,
      numOfForwardClicks,
      currentMode,
      visualScore,
      verbalScore,
    } = req.body;

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

    let response;
    if (
      (behavior_signal === "VisualDominant" && visualScore < 0.8) ||
      (behavior_signal === "VerbalDominant" && verbalScore < 0.8)
    ) {
      response = await axiosInstance.post(`/update-learning-style`, {
        user_id,
        behavior_signal,
      });

      const behaviorSignal =
        behavior_signal === "VisualDominant" ? "Visual" : "Verbal";

      const isStyleChanedToBeUpdated =
        user.lastPreferredLearningStyle !== behaviorSignal;

      await user.updateOne({
        lastPreferredLearningStyle: behaviorSignal,
      });

      if (isStyleChanedToBeUpdated) {
        await user.updateOne({
          styleChange: {
            isDetected: !user.styleChange.isDetected,
            isChanged: user.styleChange.isChanged,
          },
        });

        console.log(
          "Learning style update completed successfully:",
          response.data,
        );
        console.log("Learning style update completed successfully");
      }
    }

    res.status(200).json(response?.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while updating the learning style",
    });
  }
};

exports.setStyleChanged = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.updateOne({
      styleChange: {
        isChanged: !user.styleChange.isChanged,
        isDetected: user.styleChange.isDetected,
      },
    });

    console.log("Learning style change detected and updated successfully");
    res.status(200).json({
      message: "Learning style change detected and updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while setting the learning style change",
    });
  }
};

exports.initializeDifficultyNetwork = async (req, res) => {
  try {
    const { userId, topic } = req.body;
    await axiosInstance.post("/initialize-difficulty-network", {
      user_id: userId,
      topic,
    });

    console.log(
      "Difficulty network initialized successfully for user:",
      userId,
    );
    res
      .status(200)
      .json({ message: "Difficulty network initialized successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while initializing the difficulty network",
    });
  }
};

exports.inferDifficulty = async (req, res) => {
  console.log(
    "Received request to infer difficulty level for user:",
    req.params.userId,
    req.params.topic,
  );
  try {
    const { userId, topic } = req.params;
    const user_id = userId;

    const response = await axiosInstance.get(
      `/infer-difficulty/${user_id}/${topic}`,
    );

    console.log(
      `Difficulty inference completed, for topic ${topic} successfully:`,
      response.data,
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while inferring the difficulty level",
    });
  }
};
