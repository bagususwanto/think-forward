import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Log extends Model {}

Log.init(
  {
    userId: DataTypes.INTEGER,
    action: DataTypes.STRING,
    entity: DataTypes.STRING,
    entityId: DataTypes.INTEGER,
    previousData: DataTypes.TEXT,
    newData: DataTypes.TEXT,
    ipAddress: DataTypes.STRING,
    userAgent: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "Log",
    tableName: "Logs",
    timestamps: true,
  }
);

export default Log;
