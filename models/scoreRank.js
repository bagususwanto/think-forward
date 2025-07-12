import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class ScoreRank extends Model {}

ScoreRank.init(
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    minScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rank: {
      type: DataTypes.STRING,
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
    modelName: "ScoreRank",
    tableName: "Score_Ranks",
    timestamps: true,
  }
);

export default ScoreRank;
