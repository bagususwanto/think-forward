import Joi from "joi";
import { ACTION_PIC_ENUM } from "../enums/reviewEnums.js";

export const reviewCounterMeasureSchema = Joi.object({
  submissionId: Joi.number().required(),
  actionPic: Joi.string()
    .valid(...ACTION_PIC_ENUM)
    .required(),
  thirdParty: Joi.string(),
  actionPlan: Joi.date().required(),
  actionDate: Joi.date().required(),
  suggestion: Joi.string().required(),
}).unknown(false);

export const reviewSolvedSchema = Joi.object({
  submissionId: Joi.number().required(),
});

export const reviewRejectedSchema = Joi.object({
  submissionId: Joi.number().required(),
  suggestion: Joi.string().required(),
});
