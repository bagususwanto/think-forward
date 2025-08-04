import Joi from "joi";

export const hazardAssessmentCreateSchema = Joi.object({
  currentActivity: Joi.string().required(),
  issue: Joi.string().required(),
  expectedCondition: Joi.string().required(),
  improvementSuggestion: Joi.string().allow(""),
}).unknown(false);
