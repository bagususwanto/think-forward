import hazardControlLevelService from "../services/hazardControlLevelService.js";
import { successResponse } from "../middlewares/successResponse.js";

export default {
  async create(req, res, next) {
    try {
      const hazardControlLevel = await hazardControlLevelService.create(
        req.body,
        req
      );
      return successResponse(res, {
        message: "HazardControlLevel created successfully",
        data: hazardControlLevel,
        status: 201,
      });
    } catch (err) {
      next(err);
    }
  },
  async findAll(req, res, next) {
    try {
      const hazardControlLevels = await hazardControlLevelService.findAll();
      return successResponse(res, {
        message: "List of hazard control levels",
        data: hazardControlLevels,
      });
    } catch (err) {
      next(err);
    }
  },
  async findById(req, res, next) {
    try {
      const hazardControlLevel = await hazardControlLevelService.findById(
        req.params.id
      );
      if (!hazardControlLevel)
        return res
          .status(404)
          .json({ success: false, message: "HazardControlLevel not found" });
      return successResponse(res, {
        message: "HazardControlLevel detail",
        data: hazardControlLevel,
      });
    } catch (err) {
      next(err);
    }
  },
  async update(req, res, next) {
    try {
      const updated = await hazardControlLevelService.update(
        req.params.id,
        req.body,
        req
      );
      return successResponse(res, {
        message: "HazardControlLevel updated successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },
  async delete(req, res, next) {
    try {
      const deleted = await hazardControlLevelService.delete(
        req.params.id,
        req
      );
      if (!deleted)
        return res
          .status(404)
          .json({ success: false, message: "HazardControlLevel not found" });
      return successResponse(res, {
        message: "HazardControlLevel deleted successfully",
        data: deleted,
      });
    } catch (err) {
      next(err);
    }
  },
};
