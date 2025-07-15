import { HazardAssessment, sequelize } from "../models/index.js";
import { hazardAssessmentCreateSchema } from "../schemas/hazardAssessmentSchema.js";
import { logAction } from "./logService.js";

function validateHazardAssessmentCreate(data) {
  const { error } = hazardAssessmentCreateSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const err = new Error("Validation error");
    err.details = error.details.map((d) => d.message);
    throw err;
  }
}

export default {
  async create(data, submissionId, userId, req) {
    validateHazardAssessmentCreate(data);
    const hazardAssessment = await HazardAssessment.create({
      submissionId,
      ...data,
    });
    await logAction({
      userId,
      action: "create",
      entity: "HazardAssessment",
      entityId: hazardAssessment.id,
      previousData: null,
      newData: hazardAssessment.toJSON(),
      req,
    });
    return hazardAssessment;
  },
};
