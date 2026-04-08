const r2Client = require("../utils/r2Client");

const buketName = "adaptive-ct-education";

exports.getLecture = async (req, res) => {
  try {
    const { type, topic } = req.query;

    const expiresInSeconds = 3600;
    const url = await r2Client.presignedGetObject(
      buketName,
      `${type === "verbal" ? "verbal-slides" : "visual-slides"}/${topic}.pdf`,
      expiresInSeconds,
    );

    return res
      .status(200)
      .json({ message: "Buckets fetched successfully", url });
  } catch (error) {
    console.error("Error fetching lecture:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the lecture" });
  }
};

exports.uploadLecture = async (req, res) => {
  try {
    const { type, topic } = req.body;
    const fileBuffer = req.file.buffer;
    const fileName =
      topic === "loops"
        ? "loops.pdf"
        : topic === "conditionals"
          ? "conditionals.pdf"
          : "sequential.pdf";
    const fileSize = req.file.size;

    const destinationPath = `${type === "verbal" ? "verbal-slides" : "visual-slides"}/${fileName}`;

    await r2Client.putObject(buketName, destinationPath, fileBuffer, fileSize, {
      "Content-Type": "application/pdf",
    });

    const expiresInSeconds = 3600;
    const url = await r2Client.presignedGetObject(
      buketName,
      `${type === "verbal" ? "verbal-slides" : "visual-slides"}/${topic}.pdf`,
      expiresInSeconds,
    );

    return res
      .status(200)
      .json({ message: "Lecture uploaded successfully", url });
  } catch (error) {
    console.error("Error uploading lecture:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while uploading the lecture" });
  }
};

exports.deleteLecture = async (req, res) => {
  try {
    const { type, topic } = req.query;

    await r2Client.removeObject(
      buketName,
      `${type === "verbal" ? "verbal-slides" : "visual-slides"}/${topic}.pdf`,
    );

    return res.status(200).json({ message: "Lecture deleted successfully" });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the lecture" });
  }
};
