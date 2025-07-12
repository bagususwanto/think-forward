import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Review extends Model {}

Review.init(
  {
    submissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    actionPic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    actionPicUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    actionPlan: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    actionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    suggestion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    solvedAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "Reviews",
    timestamps: true,
  }
);

export default Review;
