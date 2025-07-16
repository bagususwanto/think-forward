import scoreRankService from "../services/scoreRankService.js";
import { successResponse } from "../middlewares/successResponse.js";

export default {
  async create(req, res, next) {
    try {
      const scoreRank = await scoreRankService.create(req.body, req);
      return successResponse(res, {
        message: "ScoreRank created successfully",
        data: scoreRank,
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
      const result = await scoreRankService.findAll({ page, limit, q });
      return successResponse(res, {
        message: "List of score ranks",
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
      const scoreRank = await scoreRankService.findById(req.params.id);
      if (!scoreRank)
        return res
          .status(404)
          .json({ success: false, message: "ScoreRank not found" });
      return successResponse(res, {
        message: "ScoreRank detail",
        data: scoreRank,
      });
    } catch (err) {
      next(err);
    }
  },
  async update(req, res, next) {
    try {
      const updated = await scoreRankService.update(
        req.params.id,
        req.body,
        req
      );
      return successResponse(res, {
        message: "ScoreRank updated successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },
  async delete(req, res, next) {
    try {
      const deleted = await scoreRankService.delete(req.params.id, req);
      if (!deleted)
        return res
          .status(404)
          .json({ success: false, message: "ScoreRank not found" });
      return successResponse(res, {
        message: "ScoreRank deleted successfully",
        data: deleted,
      });
    } catch (err) {
      next(err);
    }
  },
};
