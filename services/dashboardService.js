import { Op, Submission } from "../models/index.js";
import { accidentLevelCreateSchema } from "../schemas/accidentLevelSchema.js";
import { getLineByIds, getUserByIds } from "./externalAPIService.js";

function validateAccidentLevelCreate(data) {
  const { error } = accidentLevelCreateSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const err = new Error("Validation error");
    err.details = error.details.map((d) => d.message);
    throw err;
  }
}

export default {
  async findAllGroupedByStatus(req, q) {
    const sectionId = req.user.sectionId;
    const { type, period } = q;

    // Hitung total keseluruhan data (tanpa group)
    const total = await Submission.count({
      where: {
        type: type || "",
        createdAt: {
          [Op.gte]: period ? new Date(period) : new Date(),
        },
        sectionId,
      },
    });

    const result = await Submission.findAll({
      where: {
        type: type || "",
        createdAt: {
          [Op.gte]: period ? new Date(period) : new Date(),
        },
        sectionId,
      },
      attributes: [
        "status",
        [
          Submission.sequelize.fn("COUNT", Submission.sequelize.col("status")),
          "count",
        ],
      ],
      group: ["status"],
    });
    if (!result || result.length === 0) {
      const err = new Error("Data not found");
      err.status = 404;
      throw err;
    }

    return {
      data: { ...result, total },
    };
  },
  async findAllGroupedByLine(req, q) {
    const sectionId = req.user.sectionId;
    const { type, period } = q;

    const result = await Submission.findAll({
      where: {
        type: type || "",
        createdAt: {
          [Op.gte]: period ? new Date(period) : new Date(),
        },
        sectionId,
      },
      attributes: [
        "lineId",
        [
          Submission.sequelize.fn("COUNT", Submission.sequelize.col("lineId")),
          "count",
        ],
      ],
      group: ["lineId"],
    });
    if (!result || result.length === 0) {
      const err = new Error("Data not found");
      err.status = 404;
      throw err;
    }

    const lineIds = result.map((item) => item.lineId);
    const lines = await getLineByIds(lineIds);

    const data = result.map((item) => ({
      ...item.toJSON(),
      line: lines.find((line) => line.id === item.lineId) || null,
    }));

    return {
      data,
    };
  },
};
