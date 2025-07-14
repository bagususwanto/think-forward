import { Sequelize } from "sequelize";
import { createNamespace } from "cls-hooked";
import config from "./config.js";

// Buat namespace CLS
const namespace = createNamespace("transaction-namespace");

// Hubungkan CLS ke Sequelize
Sequelize.useCLS(namespace);

// Buat instance Sequelize
const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    port: config.db.port,
    dialectOptions: config.db.dialectOptions,
    logging: false,
  }
);

export default sequelize;
