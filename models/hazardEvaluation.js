import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class HazardEvaluation extends Model {}

HazardEvaluation.init(
  {
    submissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accidentLevel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hazardControlLevel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workingFrequency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rank: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "HazardEvaluation",
    tableName: "Hazard_Evaluation",
    timestamps: true,
  }
);

export default HazardEvaluation;
