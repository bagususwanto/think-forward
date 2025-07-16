import workingFrequencyService from "../services/workingFrequencyService.js";
import { successResponse } from "../middlewares/successResponse.js";

export default {
  async create(req, res, next) {
    try {
      const workingFrequency = await workingFrequencyService.create(
        req.body,
        req
      );
      return successResponse(res, {
        message: "WorkingFrequency created successfully",
        data: workingFrequency,
        status: 201,
      });
    } catch (err) {
      next(err);
    }
  },
  async findAll(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const q = req.query.q || "";
      const result = await workingFrequencyService.findAll({ page, limit, q });
      return successResponse(res, {
        message: "List of working frequencies",
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
  async findById(req, res, next) {
    try {
      const workingFrequency = await workingFrequencyService.findById(
        req.params.id
      );
      if (!workingFrequency)
        return res
          .status(404)
          .json({ success: false, message: "WorkingFrequency not found" });
      return successResponse(res, {
        message: "WorkingFrequency detail",
        data: workingFrequency,
      });
    } catch (err) {
      next(err);
    }
  },
  async update(req, res, next) {
    try {
      const updated = await workingFrequencyService.update(
        req.params.id,
        req.body,
        req
      );
      return successResponse(res, {
        message: "WorkingFrequency updated successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },
  async delete(req, res, next) {
    try {
      const deleted = await workingFrequencyService.delete(req.params.id, req);
      if (!deleted)
        return res
          .status(404)
          .json({ success: false, message: "WorkingFrequency not found" });
      return successResponse(res, {
        message: "WorkingFrequency deleted successfully",
        data: deleted,
      });
    } catch (err) {
      next(err);
    }
  },
};
