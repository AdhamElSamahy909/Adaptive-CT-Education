const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");

router.get("/:type", testController.getTestByType);

router.post("/", testController.createTest);

module.exports = router;
