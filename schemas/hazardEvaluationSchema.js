import Joi from "joi";

export const hazardEvaluationCreateSchema = Joi.object({
  accidentLevelId: Joi.number().required(),
  hazardControlLevelId: Joi.number().required(),
  workingFrequencyId: Joi.number().required(),
}).unknown(false);
