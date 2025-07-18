import express from "express";
import accidentLevelController from "../controllers/accidentLevelController.js";
import hazardControlLevelController from "../controllers/hazardControlLevelController.js";
import scoreRankController from "../controllers/scoreRankController.js";
import workingFrequencyController from "../controllers/workingFrequencyController.js";
import publicController from "../controllers/publicController.js";

const router = express.Router();

router.get("/accident-levels", accidentLevelController.findAll);
router.get("/hazard-control-levels", hazardControlLevelController.findAll);
router.get("/score-ranks", scoreRankController.findAll);
router.get("/working-frequencies", workingFrequencyController.findAll);
router.post(
  "/hazard-evaluation/calculate",
  publicController.calculateHazardEvaluation
);

export default router;
