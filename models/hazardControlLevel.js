import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class HazardControlLevel extends Model {}

HazardControlLevel.init(
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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updatedBy: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "HazardControlLevel",
    tableName: "Hazard_Control_Levels",
    timestamps: true,
  }
);

export default HazardControlLevel;
