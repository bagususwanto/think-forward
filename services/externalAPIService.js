import axios from "axios";
import config from "../config/config.js";

export const getUserByIds = async (ids) => {
  try {
    const response = await axios.get(`${config.TWIIS_API_URL}/user-ids`, {
      params: { ids: ids.join(",") },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ids:", error);
    throw error;
  }
};
