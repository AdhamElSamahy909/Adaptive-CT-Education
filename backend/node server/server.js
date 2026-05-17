const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./.env" });

const DB = process.env.MONGO_URI;

mongoose.connect(DB).then(() => console.log("DB connected"));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
