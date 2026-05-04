const Exercise = require("../models/exercise");

exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find().lean();

    return res.status(200).json({ exercises });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching exercises" });
  }
};

exports.getExercisesByTopic = async (req, res) => {
  try {
    const { topicName } = req.params;
    const exercises = await Exercise.find({ topic: topicName }).lean();

    return res.status(200).json({ exercises });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching exercises" });
  }
};

exports.createExercises = async (req, res) => {
  try {
    const { exercises } = req.body;

    console.log("Received exercises data: ", exercises);

    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({ message: "Exercises array is required" });
    }

    const createdExercises = await Exercise.insertMany(exercises);

    return res
      .status(201)
      .json({ message: "Exercises created", createdExercises });
  } catch (error) {
    console.error("Error creating exercises:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating exercises" });
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExercise = await Exercise.findByIdAndDelete(id);

    if (!deletedExercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    return res
      .status(200)
      .json({ message: "Exercise deleted", deletedExercise });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the exercise" });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedExercise = await Exercise.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedExercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    return res
      .status(200)
      .json({ message: "Exercise updated", updatedExercise });
  } catch (error) {
    console.error("Error updating exercise:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the exercise" });
  }
};

exports.executeExercise = async (req, res, next) => {
  const { code, problemId, userId, timeTaken, problemLevel, topic } = req.body;
  try {
    const problem = await Exercise.findById(problemId);
    // const problem = exercises.find((exercise) => exercise.id === problemId);
    console.log("Code Execution Request Data: ", {
      code,
      problemId,
      userId,
      timeTaken,
      problemLevel,
    });
    console.log(`Code for problem ${problemId}: `, code);

    const results = [];
    console.log(
      "Code saved successfully. Sending execution request to Python microservice...",
    );
    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i];

      console.log("Sending execution request: ", {
        code,
        title: problem.title,
        test_case: testCase,
        timeout: 5,
        test_case_num: i + 1,
      });

      const response = await axiosInstance.post("/execute-code", {
        code,
        title: problem.title,
        test_case: testCase,
        timeout: 5,
        test_case_num: i + 1,
        expected: testCase.output,
      });

      console.log(
        "Received response from Python microservice: ",
        response.data,
      );

      const result = response.data;

      results.push({
        testCase: i + 1,
        passed: result.passed,
        output: result.output,
        expected: testCase.output,
        error: result.error,
        execution_time: result.execution_time,
      });
      if (!result.passed && result.error) {
        break;
      }
    }

    console.log("Current User: ", req.user);
    let performanceSignal =
      problemLevel === "easy"
        ? "EasySignal"
        : problemLevel === "medium"
          ? "MediumSignal"
          : "HardSignal";
    switch (problemLevel) {
      case "easy":
        if (timeTaken < 3) performanceSignal = "MediumSignal";
        console.log("Performance signal for easy problem: ", performanceSignal);
        break;
      case "medium":
        if (timeTaken < 10) performanceSignal = "HardSignal";
        console.log(
          "Performance signal for medium problem: ",
          performanceSignal,
        );
        break;
      case "hard":
        if (timeTaken > 15) performanceSignal = "MediumSignal";
        console.log("Performance signal for hard problem: ", performanceSignal);
        break;
      default:
        console.log("Unknown problem level: ", problemLevel);
    }

    const allPassed = results.every((r) => r.passed);
    if (allPassed) {
      await User.findByIdAndUpdate(userId, {
        $push: { problemsSolved: problemId },
      });

      const updateResponse = await axiosInstance.post("/update-difficulty", {
        user_id: userId,
        performance_signal: performanceSignal,
        topic,
      });

      console.log("Difficulty update response: ", updateResponse.data);
    }

    res.json({
      success: allPassed,
      results,
      totalTests: problem.testCases.length,
      passedTests: results.filter((r) => r.passed).length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.detectStruggling = async (req, res) => {
  const { userId, attemptNum, timeDelta, testProgress } = req.body;
  console.log("Received struggling detection request for user: ", userId);
  console.log("Data to be used for struggling detection: ", {
    attemptNum,
    timeDelta,
    testProgress,
  });

  try {
    const response = await axiosInstance.post("/detect-struggling", {
      user_id: userId,
      attempt_num: attemptNum,
      time_delta: timeDelta,
      test_progress: testProgress,
    });

    console.log(
      "Received response from struggling detection microservice: ",
      response.data,
    );

    res.json({
      success: true,
      struggling: response.data.struggling,
    });
  } catch (error) {
    console.error("Error during struggling detection: ", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.get10RandomExercises = async (req, res) => {
  try {
    const loopsExercises = await Exercise.aggregate([
      { $match: { topic: "loops" } },
      { $sample: { size: 4 } },
    ]);
    const conditionalsExercises = await Exercise.aggregate([
      { $match: { topic: "conditionals" } },
      { $sample: { size: 3 } },
    ]);
    const sequentailExercises = await Exercise.aggregate([
      { $match: { topic: "sequential" } },
      { $sample: { size: 3 } },
    ]);

    return res.status(200).json({
      exercises: [
        ...loopsExercises,
        ...conditionalsExercises,
        ...sequentailExercises,
      ],
    });
  } catch (error) {
    console.error("Error fetching random exercises: ", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching random exercises",
    });
  }
};
