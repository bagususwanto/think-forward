import express from "express";
import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import config from "./config/config.js";
import { sequelize } from "./models/index.js";
import submissionRoutes from "./routes/submissionRoutes.js";

// Import routes (nanti tambahkan semua route utama di sini)
// import submissionRoutes from './routes/submissionRoutes.js';

const app = express();

app.use(express.json());
app.use(logger);

app.use("/api/submissions", submissionRoutes);
// Tambahkan route lain sesuai kebutuhan

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use(errorHandler);

// Sync DB dan start server
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected!");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
