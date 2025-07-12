import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class AccidentLevel extends Model {}

AccidentLevel.init(
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
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
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "AccidentLevel",
    tableName: "Accident_Levels",
    timestamps: true,
  }
);

export default AccidentLevel;
