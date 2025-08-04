import { successResponse } from "../middlewares/successResponse.js";
import submissionService from "../services/submissionService.js";

export default {
  async findAllGroupedByStatus(req, res, next) {
    try {
      const q = req.query || "";
      const result = await submissionService.findAllGroupedByStatus(req, q);
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
      const result = await submissionService.findAllGroupedByLine(req, q);
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
      const result = await submissionService.findAllGroupedByAccindentType(
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
  async findAllGroupedByUserId(req, res, next) {
    try {
      const query = req.query || "";
      const result = await submissionService.findAllGroupedByUserId(req, query);
      return successResponse(res, {
        message: "Submission grouped by user retrieved successfully",
        data: result.data,
      });
    } catch (err) {
      next(err);
    }
  },
  async findAll(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const query = req.query || "";
      const result = await submissionService.findAll({
        page,
        limit,
        query,
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
