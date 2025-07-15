import axiosInstance from "../config/axiosInstance.js";

const verifyTokenExternal = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const response = await axiosInstance.post(
      `/verify`,
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
    console.log(err);
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || "Token validation failed";
    return res.status(status).json({ message });
  }
};

export default verifyTokenExternal;
