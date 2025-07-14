import Joi from "joi";

export const hazardReportCreateSchema = Joi.object({
  submissionId: Joi.number().required(),
  pattern: Joi.string().required(),
  source: Joi.string().required(),
  injured: Joi.string().required(),
  cause: Joi.string().required(),
  category: Joi.string().required(),
  accidentType: Joi.string().required(),
  proof: Joi.string().required(),
});
