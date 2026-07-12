const express = require("express");
const router = express.Router();
const testResultsController = require("../controllers/testResultsContoller");

// router.post("/", testResultsController.submitTestResults);
router.get("/", testResultsController.getTestResults);

module.exports = router;
