import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Submission extends Model {}

Submission.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    submissionNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shift: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    incidentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    incidentTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    workProcess: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Submission",
    tableName: "Submissions",
    timestamps: true,
  }
);

export default Submission;
