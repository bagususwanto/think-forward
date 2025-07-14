import Joi from "joi";
import { SHIFT_ENUM, TYPE_ENUM } from "../enums/submissionEnums.js";

export const submissionCreateSchema = Joi.object({
  type: Joi.string()
    .valid(...TYPE_ENUM)
    .required(),
  shift: Joi.string()
    .valid(...SHIFT_ENUM)
    .required(),
  incidentDate: Joi.date().required(),
  incidentTime: Joi.string().required(),
  workProcess: Joi.string().required(),
  location: Joi.string().required(),
}).unknown(false);

export const submissionUpdateSchema = Joi.object({
  type: Joi.string().valid(...TYPE_ENUM),
  shift: Joi.string().valid(...SHIFT_ENUM),
  incidentDate: Joi.date(),
  incidentTime: Joi.string(),
  workProcess: Joi.string(),
  location: Joi.string(),
}).unknown(false);
