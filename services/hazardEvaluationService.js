import {
  AccidentLevel,
  HazardControlLevel,
  WorkingFrequency,
  HazardEvaluation,
  ScoreRank,
  Op,
} from "../models/index.js";
import { hazardEvaluationCreateSchema } from "../schemas/hazardEvaluationSchema.js";
import { logAction } from "./logService.js";

function validateHazardEvaluationCreate(data) {
  const { error } = hazardEvaluationCreateSchema.validate(data, {
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
    validateHazardEvaluationCreate(data);

    // validasi accident level id
    const accidentLevel = await AccidentLevel.findByPk(data.accidentLevelId);
    if (!accidentLevel) {
      throw new Error("Accident level not found");
    }
    // validasi hazard control level id
    const hazardControlLevel = await HazardControlLevel.findByPk(
      data.hazardControlLevelId
    );
    if (!hazardControlLevel) {
      throw new Error("Hazard control level not found");
    }
    // validasi working frequency id
    const workingFrequency = await WorkingFrequency.findByPk(
      data.workingFrequencyId
    );
    if (!workingFrequency) {
      throw new Error("Working frequency not found");
    }

    // calculate total score
    const totalScore =
      accidentLevel.score + hazardControlLevel.score + workingFrequency.score;

    const totalScoreRank = await ScoreRank.findOne({
      where: {
        [Op.and]: [
          {
            minScore: {
              [Op.lte]: totalScore, // totalScore >= minScore
            },
          },
          {
            maxScore: {
              [Op.gte]: totalScore, // totalScore <= maxScore
            },
          },
        ],
      },
    });

    if (!totalScoreRank) {
      throw new Error("Total score rank not found");
    }

    // rank = accidentLevel.rank + totalScore ref
    const rank =
      accidentLevel.rank.toUpperCase() + totalScoreRank.rank.toLowerCase();

    const hazardEvaluation = await HazardEvaluation.create({
      ...data,
      submissionId,
      totalScore,
      rank,
    });
    await logAction({
      userId,
      action: "create",
      entity: "HazardEvaluation",
      entityId: hazardEvaluation.id,
      previousData: null,
      newData: hazardEvaluation.toJSON(),
      req,
    });
    return hazardEvaluation;
  },
};
