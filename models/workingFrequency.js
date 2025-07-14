import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class WorkingFrequency extends Model {}

WorkingFrequency.init(
  {
    option: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updatedBy: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "WorkingFrequency",
    tableName: "Working_Frequencies",
    timestamps: true,
  }
);

export default WorkingFrequency;
