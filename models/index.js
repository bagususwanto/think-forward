import sequelize from "../config/database.js";
import { Op } from "sequelize";
import Submission from "./submission.js";
import HazardAssessment from "./hazardAssessment.js";
import HazardReport from "./hazardReport.js";
import HazardEvaluation from "./hazardEvaluation.js";
import Review from "./review.js";
import Log from "./log.js";
import AccidentLevel from "./accidentLevel.js";
import HazardControlLevel from "./hazardControlLevel.js";
import WorkingFrequency from "./workingFrequency.js";
import ScoreRank from "./scoreRank.js";

// Relasi antar model
Submission.hasOne(HazardAssessment, { foreignKey: "submissionId" });
HazardAssessment.belongsTo(Submission, { foreignKey: "submissionId" });

Submission.hasOne(HazardReport, { foreignKey: "submissionId" });
HazardReport.belongsTo(Submission, { foreignKey: "submissionId" });

Submission.hasOne(HazardEvaluation, { foreignKey: "submissionId" });
HazardEvaluation.belongsTo(Submission, { foreignKey: "submissionId" });

Submission.hasMany(Review, { foreignKey: "submissionId" });
Review.belongsTo(Submission, { foreignKey: "submissionId" });

export {
  sequelize,
  Op,
  Submission,
  HazardAssessment,
  HazardReport,
  HazardEvaluation,
  Review,
  Log,
  AccidentLevel,
  HazardControlLevel,
  WorkingFrequency,
  ScoreRank,
};
