import Joi from "joi";
import { SHIFT_ENUM, TYPE_ENUM } from "../enums/submissionEnums.js";

export const submissionCreateSchema = Joi.object({
  userId: Joi.number().required(),
  type: Joi.string()
    .valid(...TYPE_ENUM)
    .required(),
  shift: Joi.string()
    .valid(...SHIFT_ENUM)
    .required(),
  incidentDate: Joi.date().required(),
  incidentTime: Joi.string().required(),
  lineId: Joi.number().allow(null), // Optional, can be null
  sectionId: Joi.number().required(),
  location: Joi.string().required(),
}).unknown(false);

export const submissionUpdateSchema = Joi.object({
  type: Joi.string().valid(...TYPE_ENUM),
  shift: Joi.string().valid(...SHIFT_ENUM),
  incidentDate: Joi.date(),
  incidentTime: Joi.string(),
  lineId: Joi.number().allow(null), // Optional, can be null
  sectionId: Joi.number(),
  location: Joi.string(),
}).unknown(false);
