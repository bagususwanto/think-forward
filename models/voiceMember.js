import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class VoiceMember extends Model {}

VoiceMember.init(
  {
    submissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentActivity: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    issue: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expectedCondition: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    improvementSuggestion: DataTypes.TEXT,
    proof: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "VoiceMember",
    tableName: "Voice_Members",
    timestamps: true,
  }
);

export default VoiceMember;
