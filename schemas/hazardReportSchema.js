import Joi from "joi";
import {
  PATTERN_ENUM,
  SOURCE_ENUM,
  INJURED_ENUM,
  CAUSE_ENUM,
  CATEGORY_ENUM,
  ACCIDENT_TYPE_ENUM,
} from "../enums/hazardReportEnums.js";

export const hazardReportCreateSchema = Joi.object({
  pattern: Joi.string()
    .valid(...PATTERN_ENUM)
    .required(),
  source: Joi.string()
    .valid(...SOURCE_ENUM)
    .required(),
  injured: Joi.string()
    .valid(...INJURED_ENUM)
    .required(),
  cause: Joi.string()
    .valid(...CAUSE_ENUM)
    .required(),
  category: Joi.string()
    .valid(...CATEGORY_ENUM)
    .required(),
  accidentType: Joi.string()
    .valid(...ACCIDENT_TYPE_ENUM)
    .required(),
}).unknown(false);
