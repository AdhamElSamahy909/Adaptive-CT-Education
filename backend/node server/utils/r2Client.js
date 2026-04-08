const Minio = require("minio");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

module.exports = r2Client = new Minio.Client({
  endPoint: `${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: "auto",
  useSSL: true,
  accessKey: `${process.env.R2_ACCESS_KEY_ID}`,
  secretKey: `${process.env.R2_SECRET_ACCESS_KEY}`,
});
