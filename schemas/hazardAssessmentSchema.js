import Joi from "joi";

export const hazardAssessmentCreateSchema = Joi.object({
  currentActivity: Joi.string().required(),
  potentialHazard: Joi.string().required(),
  hazardReason: Joi.string().required(),
  expectedCondition: Joi.string().required(),
  improvementSuggestion: Joi.string(),
}).unknown(false);
