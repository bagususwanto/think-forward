import axiosInstance from "../config/axiosInstance.js";

export const getUserByIds = async (ids) => {
  try {
    const response = await axiosInstance.get(`/user-ids`, {
      params: { ids: ids.join(",") },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ids:", error);
    throw error;
  }
};

export const getUserIdsByOrganization = async (req) => {
  try {
    const response = await axiosInstance.get(`/user-organization`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user organization:", error);
    throw error;
  }
};

export const checkUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(`/check-user-id`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking user id:", error);
    throw error;
  }
};
