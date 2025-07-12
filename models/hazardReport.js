import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class HazardReport extends Model {}

HazardReport.init(
  {
    submissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pattern: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    injured: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cause: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accidentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    proof: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "HazardReport",
    tableName: "Hazard_Reports",
    timestamps: true,
  }
);

export default HazardReport;
