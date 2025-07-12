import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class HazardAssessment extends Model {}

HazardAssessment.init(
  {
    submissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentActivity: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    potentialHazard: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    hazardReason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expectedCondition: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    improvementSuggestion: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: "HazardAssessment",
    tableName: "Hazard_Assessments",
    timestamps: true,
  }
);

export default HazardAssessment;
