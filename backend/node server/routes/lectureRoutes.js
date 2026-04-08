const express = require("express");
const lectureController = require("../controllers/lectureController");
const multer = require("multer");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", lectureController.getLecture);
router.post("/", upload.single("pdf_file"), lectureController.uploadLecture);
router.delete("/", lectureController.deleteLecture);

module.exports = router;
