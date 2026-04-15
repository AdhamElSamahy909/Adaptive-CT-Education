const express = require("express");
const exerciseController = require("../controllers/exerciseController");

const router = express.Router();

router.get("/", exerciseController.getExercises);
router.post("/", exerciseController.createExercises);
router.delete("/:id", exerciseController.deleteExercise);
router.patch("/:id", exerciseController.updateExercise);
router.post("/execute", exerciseController.executeExercise);
router.post("/detect-struggling", exerciseController.detectStruggling);
router.get("/10-random", exerciseController.get10RandomExercises);

module.exports = router;
