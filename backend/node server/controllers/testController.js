const Test = require("../models/testModel");

exports.getTestByType = async (req, res) => {
  try {
    const { type } = req.params;
    if (!["pretest", "posttest"].includes(type)) {
      return res
        .status(400)
        .json({ error: "Invalid test type. Must be 'pretest' or 'posttest'." });
    }

    const test = await Test.findOne({ type });
    if (!test) {
      return res.status(404).json({ error: "Test not found." });
    }

    res.status(200).json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error retrieving test." });
  }
};

exports.createTest = async (req, res) => {
  try {
    const { type, questions } = req.body;

    if (!["pretest", "posttest"].includes(type)) {
      return res
        .status(400)
        .json({ error: "Invalid test type. Must be 'pretest' or 'posttest'." });
    }

    const existingTest = await Test.findOne({ type });
    if (existingTest) {
      return res.status(400).json({
        error: "A test of this type already exists. Update it instead.",
      });
    }

    const test = new Test({ type, questions });
    await test.save();

    res.status(201).json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error creating test." });
  }
};
