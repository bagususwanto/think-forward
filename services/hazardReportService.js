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
  async create(data, submissionId, userId) {
    validateHazardReportCreate(data);
    return sequelize.transaction(async () => {
      const hazardReport = await HazardReport.create({
        submissionId,
        pattern: data.pattern,
        source: data.source,
        injured: data.injured,
        cause: data.cause,
        category: data.category,
        accidentType: data.accidentType,
        proof: data.proof,
      });
      await logAction({
        userId,
        action: "create",
        entity: "HazardReport",
        entityId: hazardReport.id,
        previousData: null,
        newData: hazardReport.toJSON(),
      });
      return hazardReport;
    });
  },
};
