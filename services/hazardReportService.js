import { HazardReport, sequelize } from "../models/index.js";
import { hazardReportCreateSchema } from "../schemas/hazardReportSchema.js";
import { logAction } from "./logService.js";

function validateHazardReportCreate(data) {
  const { error } = hazardReportCreateSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const err = new Error("Validation error");
    err.details = error.details.map((d) => d.message);
    throw err;
  }
}

export default {
  async create(data, submissionId, userId, req) {
    validateHazardReportCreate(data);
    if (!req.file) {
      throw new Error("File proof is required");
    }
    const hazardReport = await HazardReport.create({
      submissionId,
      proof: req.file.path,
      ...data,
    });
    await logAction({
      userId,
      action: "create",
      entity: "HazardReport",
      entityId: hazardReport.id,
      previousData: null,
      newData: hazardReport.toJSON(),
      req,
    });
    return hazardReport;
  },
};
