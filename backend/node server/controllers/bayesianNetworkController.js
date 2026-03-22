const axiosInstance = require("../lib/axiosInstance");

exports.coldStart = async (req, res) => {
  try {
    const { userId, challenge1Result, challenge2Result } = req.body;
    const visualScore = challenge1Result === "A" ? "Pass" : "Fail";
    const verbalScore = challenge2Result === "D" ? "Pass" : "Fail";

    const response = await axiosInstance.post("/cold-start", {
      user_id: userId,
      visual_score: visualScore,
      verbal_score: verbalScore,
    });

    console.log(
      "Cold start challenge results processed successfully:",
      response.data,
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while processing the cold start challenge results",
    });
  }
};
