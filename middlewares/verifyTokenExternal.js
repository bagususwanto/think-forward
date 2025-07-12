import axios from "axios";
import config from "../config/config.js";

const verifyTokenExternal = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const response = await axios.post(
      `${config.TWIIS_API_URL}/verify`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );

    req.user = response.data;
    next();
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || "Token validation failed";
    return res.status(status).json({ message });
  }
};

export default verifyTokenExternal;
