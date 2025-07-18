import { successResponse } from "../middlewares/successResponse.js";
import { validateAndCalculateHazardEvaluation } from "../services/hazardEvaluationService.js";

export default {
  async calculateHazardEvaluation(req, res, next) {
    try {
      const data = req.body;
      const { totalScore, rank } = await validateAndCalculateHazardEvaluation(
        data
      );
      return successResponse(res, {
        message: "Hazard evaluation calculated successfully",
        data: { totalScore, rank },
      });
    } catch (err) {
      next(err);
    }
  },
};
