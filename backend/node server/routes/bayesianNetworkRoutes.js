const express = require("express");
const bayesianNetworkController = require("../controllers/bayesianNetworkController");

const router = express.Router();

router.post("/learning-style/cold-start", bayesianNetworkController.coldStart);

router.get(
  "/learning-style/infer/:userId",
  bayesianNetworkController.inferLearningStyle,
);

router.post(
  "/learning-style/update/:userId",
  bayesianNetworkController.updateLearningStyle,
);

router.post(
  "/difficulty/initialize",
  bayesianNetworkController.initializeDifficultyNetwork,
);

router.get(
  "/difficulty/infer/:userId/topic/:topic",
  bayesianNetworkController.inferDifficulty,
);

module.exports = router;
