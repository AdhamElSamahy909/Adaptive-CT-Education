const express = require("express");
const surveyResultsController = require("../controllers/surveyResultsController");
const router = express.Router();

// router
//   .route("/")
//   .get(surveyResultsController.getAllSurveyResults)
//   .post(surveyResultsController.submitSurveyResults);

router.get("/", surveyResultsController.getAllSurveyResults);
router.get("/stats", surveyResultsController.getSurveyResultsStats);

module.exports = router;
