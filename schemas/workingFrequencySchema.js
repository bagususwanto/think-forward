import Joi from "joi";

export const workingFrequencyCreateSchema = Joi.object({
  option: Joi.string().required(),
  score: Joi.number().integer().required(),
}).unknown(false);

export const workingFrequencyUpdateSchema = Joi.object({
  option: Joi.string(),
  score: Joi.number().integer(),
}).unknown(false);
