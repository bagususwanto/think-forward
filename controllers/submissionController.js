import submissionService from "../services/submissionService.js";
import { successResponse } from "../middlewares/successResponse.js";

export default {
  async create(req, res, next) {
    try {
      const submission = await submissionService.create(req.body);
      return successResponse(res, {
        message: "Submission created successfully",
        data: submission,
        status: 201,
      });
    } catch (err) {
      next(err);
    }
  },
  async findAll(req, res, next) {
    try {
      const submissions = await submissionService.findAll();
      return successResponse(res, {
        message: "List of submissions",
        data: submissions,
      });
    } catch (err) {
      next(err);
    }
  },
  async findById(req, res, next) {
    try {
      const submission = await submissionService.findById(req.params.id);
      if (!submission)
        return res
          .status(404)
          .json({ success: false, message: "Submission not found" });
      return successResponse(res, {
        message: "Submission detail",
        data: submission,
      });
    } catch (err) {
      next(err);
    }
  },
  async update(req, res, next) {
    try {
      const updated = await submissionService.update(req.params.id, req.body);
      return successResponse(res, {
        message: "Submission updated successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },
  async remove(req, res, next) {
    try {
      await submissionService.remove(req.params.id);
      return successResponse(res, {
        message: "Submission deleted successfully",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  },
};
