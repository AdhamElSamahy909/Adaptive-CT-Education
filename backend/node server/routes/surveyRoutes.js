const express = require("express");
const surveyController = require("../controllers/surveyController");

const router = express.Router();

router
  .route("/")
  .get(surveyController.getSurvey)
  .post(surveyController.createSurvey);

module.exports = router;
