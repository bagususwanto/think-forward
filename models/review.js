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
    actionPic: DataTypes.STRING,
    actionPicUserId: DataTypes.INTEGER,
    actionPlan: DataTypes.DATEONLY,
    actionDate: DataTypes.DATEONLY,
    suggestion: DataTypes.TEXT,
    solvedAt: DataTypes.DATEONLY,
    proof: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "Reviews",
    timestamps: true,
  }
);

export default Review;
