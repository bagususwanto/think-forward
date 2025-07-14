import Joi from "joi";

export const hazardControlLevelCreateSchema = Joi.object({
  option: Joi.string().required(),
  score: Joi.number().integer().required(),
}).unknown(false);

export const hazardControlLevelUpdateSchema = Joi.object({
  option: Joi.string(),
  score: Joi.number().integer(),
}).unknown(false);
