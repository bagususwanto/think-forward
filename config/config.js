import dotenv from "dotenv";
dotenv.config();

export default {
  TWIIS_API_URL: process.env.TWIIS_API_URL,
  port: process.env.PORT || 5005,
  db: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mssql",
    port: process.env.DB_PORT || 1433,
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: true,
        requestTimeout: 60000, // 60 seconds
        connectionTimeout: 60000, // 60 seconds
        commandTimeout: 60000, // 60 seconds
      },
    },
  },
};
