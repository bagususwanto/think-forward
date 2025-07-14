import Joi from "joi";

export const hazardEvaluationCreateSchema = Joi.object({
  submissionId: Joi.number().required(),
  accidentLevel: Joi.string().required(),
  hazardControlLevel: Joi.string().required(),
  workingFrequency: Joi.string().required(),
  totalScore: Joi.number().required(),
  rank: Joi.string().required(),
});
