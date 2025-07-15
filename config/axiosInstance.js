import axios from "axios";
import config from "./config.js";
import https from "https";

const axiosInstance = axios.create({
  baseURL: `${config.TWIIS_API_URL}`,
  withCredentials: true,
  // Disable SSL certificate verification for development
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

export default axiosInstance;
