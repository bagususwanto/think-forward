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

export const getUserIdsByOrganization = async () => {
  try {
    const response = await axiosInstance.get(`/user-organization`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user organization:", error);
    throw error;
  }
};
