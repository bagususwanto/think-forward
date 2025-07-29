import express from "express";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import verifyTokenExternal from "../middlewares/verifyTokenExternal.js";
import dashboardController from "../controllers/dashboardController.js";

const router = express.Router();

router.use(verifyTokenExternal);
router.use(
  roleMiddleware(["super admin", "section head", "line head", "group head"])
);

router.get("/by-status", dashboardController.findAllGroupedByStatus);
router.get("/by-line", dashboardController.findAllGroupedByLine);
router.get(
  "/by-accident-type",
  dashboardController.findAllGroupedByAccidentType
);
router.get("/recent", dashboardController.findAllRecent);

export default router;
