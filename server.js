import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";
import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import config from "./config/config.js";
import path from "path";
import submissionRoutes from "./routes/submissionRoutes.js";
import accidentLevelRoutes from "./routes/accidentLevelRoutes.js";
import hazardControlLevelRoutes from "./routes/hazardControlLevelRoutes.js";
import workingFrequencyRoutes from "./routes/workingFrequencyRoutes.js";
import scoreRankRoutes from "./routes/scoreRankRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

const app = express();
const sync = {};

app.use(
  cors({
    origin: [
      "http://192.168.8.3:5173",
      "http://192.168.8.7:5173",
      "http://localhost:5173",
      "http://192.168.8.24:3001",
    ],
    credentials: true, // untuk mengakses cookie
  })
);
app.use(express.json());
app.use(logger);

// Mengambil path direktori saat ini dan menghilangkan duplicate C:
let __dirname = path.dirname(new URL(import.meta.url).pathname);
if (process.platform === "win32") {
  __dirname = __dirname.substring(1); // Removes extra leading slash on Windows
}

// Mengatur path untuk menyimpan gambar produk
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//==ROUTES==//
// endpoint root
app.get("/", (req, res) => {
  res.json({ message: "Think-Forward API is running" });
});

// processing
app.use("/api/submissions", submissionRoutes);
app.use("/api/reviews", reviewRoutes);

// master
app.use("/api/accident-levels", accidentLevelRoutes);
app.use("/api/hazard-control-levels", hazardControlLevelRoutes);
app.use("/api/working-frequencies", workingFrequencyRoutes);
app.use("/api/score-ranks", scoreRankRoutes);

// dashboard
app.use("/api/dashboard", dashboardRoutes);

// public
app.use("/api/public", publicRoutes);

app.use(errorHandler);

//==SYNC DB DAN START SERVER==//
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
