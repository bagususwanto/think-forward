import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";
import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import config from "./config/config.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import verifyTokenExternal from "./middlewares/verifyTokenExternal.js";
import accidentLevelRoutes from "./routes/accidentLevelRoutes.js";
import hazardControlLevelRoutes from "./routes/hazardControlLevelRoutes.js";
import workingFrequencyRoutes from "./routes/workingFrequencyRoutes.js";

const app = express();
const sync = { force: false };

app.use(
  cors({
    origin: "*",
    credentials: true, // untuk mengakses cookie
  })
);
app.use(express.json());
app.use(logger);
app.use(errorHandler);

// routes non-protected
app.get("/", (req, res) => {
  res.json({ message: "Think-Forward API is running" });
});
app.use("/api/submissions", submissionRoutes);

// verify token external
app.use(verifyTokenExternal);

// routes protected
app.use("/api/accident-levels", accidentLevelRoutes);
app.use("/api/hazard-control-levels", hazardControlLevelRoutes);
app.use("/api/working-frequencies", workingFrequencyRoutes);

// Sync DB dan start server
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected!");
    return sequelize.sync(sync);
  })
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
