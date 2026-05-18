const express = require("express");
const surveyResultsController = require("../controllers/surveyResultsController");
const router = express.Router();

router
  .route("/")
  .get(surveyResultsController.getAllSurveyResults)
  .post(surveyResultsController.createSurveyResult);

module.exports = router;
