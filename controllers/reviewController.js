import reviewService from "../services/reviewService.js";
import { successResponse } from "../middlewares/successResponse.js";

export default {
  // Counter measure
  async createCounterMeasure(req, res, next) {
    try {
      const review = await reviewService.createCounterMeasure(req.body, req);
      return successResponse(res, {
        message: "Review created successfully",
        data: review,
        status: 201,
      });
    } catch (err) {
      next(err);
    }
  },

  // Solve
  async createSolved(req, res, next) {
    try {
      const review = await reviewService.createSolved(req.body, req);
      return successResponse(res, {
        message: "Review created successfully",
        data: review,
        status: 201,
      });
    } catch (err) {
      next(err);
    }
  },

  // Reject
  async createRejected(req, res, next) {
    try {
      const review = await reviewService.createRejected(req.body, req);
      return successResponse(res, {
        message: "Review created successfully",
        data: review,
        status: 201,
      });
    } catch (err) {
      next(err);
    }
  },

  // Section Suggestion
  async createSectionSuggestion(req, res, next) {
    try {
      const review = await reviewService.createSectionSuggestion(req.body, req);
      return successResponse(res, {
        message: "Review created successfully",
        data: review,
        status: 201,
      });
    } catch (err) {
      next(err);
    }
  },
};
