import { successResponse } from "../middlewares/successResponse.js";
import dashboardService from "../services/dashboardService.js";

export default {
  async findAllGroupedByStatus(req, res, next) {
    try {
      const q = req.query || "";
      const result = await dashboardService.findAllGroupedByStatus(req, q);
      return successResponse(res, {
        message: "Submission grouped by status retrieved successfully",
        data: result.data,
      });
    } catch (err) {
      next(err);
    }
  },
  async findAllGroupedByLine(req, res, next) {
    try {
      const q = req.query || "";
      const result = await dashboardService.findAllGroupedByLine(req, q);
      return successResponse(res, {
        message: "Submission grouped by line retrieved successfully",
        data: result.data,
      });
    } catch (err) {
      next(err);
    }
  },
};
