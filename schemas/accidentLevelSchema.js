import Joi from "joi";

export const accidentLevelCreateSchema = Joi.object({
  option: Joi.string().required(),
  score: Joi.number().integer().required(),
  rank: Joi.string().required(),
}).unknown(false);

export const accidentLevelUpdateSchema = Joi.object({
  option: Joi.string(),
  score: Joi.number().integer(),
  rank: Joi.string(),
}).unknown(false);
