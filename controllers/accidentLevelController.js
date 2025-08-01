import accidentLevelService from "../services/accidentLevelService.js";
import { successResponse } from "../middlewares/successResponse.js";

export default {
  async create(req, res, next) {
    try {
      const accidentLevel = await accidentLevelService.create(req.body, req);
      return successResponse(res, {
        message: "AccidentLevel created successfully",
        data: accidentLevel,
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
      const result = await accidentLevelService.findAll({ page, limit, q });
      return successResponse(res, {
        message: "List of accident levels",
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
      const accidentLevel = await accidentLevelService.findById(req.params.id);
      if (!accidentLevel)
        return res
          .status(404)
          .json({ success: false, message: "AccidentLevel not found" });
      return successResponse(res, {
        message: "AccidentLevel detail",
        data: accidentLevel,
      });
    } catch (err) {
      next(err);
    }
  },
  async update(req, res, next) {
    try {
      const updated = await accidentLevelService.update(
        req.params.id,
        req.body,
        req
      );
      return successResponse(res, {
        message: "AccidentLevel updated successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },
  async delete(req, res, next) {
    try {
      const deleted = await accidentLevelService.delete(req.params.id, req);
      if (!deleted)
        return res
          .status(404)
          .json({ success: false, message: "AccidentLevel not found" });
      return successResponse(res, {
        message: "AccidentLevel deleted successfully",
        data: deleted,
      });
    } catch (err) {
      next(err);
    }
  },
};
