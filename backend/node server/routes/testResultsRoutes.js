const express = require("express");
const router = express.Router();
const testResultsController = require("../controllers/testResultsContoller");

router.post("/", testResultsController.submitTestResults);

module.exports = router;
