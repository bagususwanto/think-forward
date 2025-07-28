import express from "express";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import verifyTokenExternal from "../middlewares/verifyTokenExternal.js";
import dashboardController from "../controllers/dashboardController.js";

const router = express.Router();

router.use(verifyTokenExternal);
router.use(
  roleMiddleware(["super admin", "section head", "line head", "group head"])
);

router.get("/report-stats", dashboardController.findAllGroupedByStatus);
router.get("/potential-hazard-line", dashboardController.findAllGroupedByLine);

export default router;
