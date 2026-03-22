const express = require("express");
const bayesianNetworkController = require("../controllers/bayesianNetworkController");

const router = express.Router();

router.post("/learning-style/cold-start", bayesianNetworkController.coldStart);

// router.get("/learning-style/infer", bayesianNetworkController.infer);

// router.post(
//   "/learning-style/update-structure",
//   bayesianNetworkController.updateStructure,
// );

module.exports = router;
