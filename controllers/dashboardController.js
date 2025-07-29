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
};
