import Joi from "joi";

export const scoreRankCreateSchema = Joi.object({
  minScore: Joi.number().integer().required(),
  maxScore: Joi.number().integer().required(),
  rank: Joi.string().required(),
}).unknown(false);

export const scoreRankUpdateSchema = Joi.object({
  minScore: Joi.number().integer(),
  maxScore: Joi.number().integer(),
  rank: Joi.string(),
}).unknown(false);
