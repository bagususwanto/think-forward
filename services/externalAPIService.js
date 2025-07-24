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

export const getLineByIds = async (ids) => {
  try {
    const response = await axiosInstance.get(`/line-ids`, {
      params: { ids: ids.join(",") },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching line by ids:", error);
    throw error;
  }
};

export const getSectionByIds = async (ids) => {
  try {
    const response = await axiosInstance.get(`/section-ids`, {
      params: { ids: ids.join(",") },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching line by ids:", error);
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
    const response = await axiosInstance.get(`/check-user-id/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error checking user id:", error);
    throw error;
  }
};

export const checkLineId = async (lineId) => {
  try {
    const response = await axiosInstance.get(`/check-line-id/${lineId}`);
    return response.data;
  } catch (error) {
    console.error("Error checking line id:", error);
    throw error;
  }
};

export const checkSectionId = async (sectionId) => {
  try {
    const response = await axiosInstance.get(`/check-section-id/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error("Error checking section id:", error);
    throw error;
  }
};
