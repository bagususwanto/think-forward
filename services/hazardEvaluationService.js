import { HazardEvaluation, sequelize } from "../models/index.js";
import { hazardEvaluationCreateSchema } from "../schemas/hazardEvaluationSchema.js";
import { logAction } from "./logService.js";

function validateHazardEvaluationCreate(data) {
  const { error } = hazardEvaluationCreateSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const err = new Error("Validation error");
    err.details = error.details.map((d) => d.message);
    throw err;
  }
}

export default {
  async create(data, submissionId, userId) {
    validateHazardEvaluationCreate(data);
    return sequelize.transaction(async () => {
      const hazardEvaluation = await HazardEvaluation.create({
        submissionId,
        ...data,
      });
      await logAction({
        userId,
        action: "create",
        entity: "HazardEvaluation",
        entityId: hazardEvaluation.id,
        previousData: null,
        newData: hazardEvaluation.toJSON(),
      });
      return hazardEvaluation;
    });
  },
};
