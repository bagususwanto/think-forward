import Joi from "joi";

export const hazardEvaluationCreateSchema = Joi.object({
  submissionId: Joi.number().required(),
  accidentLevelId: Joi.number().required(),
  hazardControlLevelId: Joi.number().required(),
  workingFrequencyId: Joi.number().required(),
  totalScore: Joi.number().required(),
  rank: Joi.string().required(),
}).unknown(false);
