const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const axiosInstance = axios.create({
  baseURL: process.env.FASTAPI_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = axiosInstance;
