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
  async findAllGroupedByAccidentType(req, res, next) {
    try {
      const q = req.query || "";
      const result = await dashboardService.findAllGroupedByAccindentType(
        req,
        q
      );
      return successResponse(res, {
        message: "Submission grouped by accident type retrieved successfully",
        data: result.data,
      });
    } catch (err) {
      next(err);
    }
  },
  async findAllRecent(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const q = req.query.q || "";
      const result = await dashboardService.findAllRecent({
        page,
        limit,
        q,
        req,
      });
      return successResponse(res, {
        message: "List of recent submissions",
        data: result.data,
        meta: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          limit: result.limit,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
