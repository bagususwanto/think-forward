import axiosInstance from "../config/axiosInstance.js";

const verifyTokenExternal = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Authorization token is missing. Please provide a valid token.",
    });
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

    if (response.status !== 200) {
      return res.status(401).json({
        message: "Invalid or expired token. Please log in again.",
      });
    }

    req.user = response.data;
    next();
  } catch (err) {
    console.error(
      "❌ Token verification failed:",
      err?.response?.data || err.message
    );

    const status = err.response?.status || 500;
    const message =
      err.response?.data?.message ||
      (status === 403
        ? "Access forbidden. Your token may be invalid or expired."
        : "An unexpected error occurred during token verification.");

    return res.status(status).json({ message });
  }
};

export default verifyTokenExternal;
