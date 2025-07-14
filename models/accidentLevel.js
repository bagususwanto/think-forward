import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class AccidentLevel extends Model {}

AccidentLevel.init(
  {
    option: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rank: {
      type: DataTypes.STRING,
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
    modelName: "AccidentLevel",
    tableName: "Accident_Levels",
    timestamps: true,
  }
);

export default AccidentLevel;
