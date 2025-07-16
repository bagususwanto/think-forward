import express from "express";
import reviewController from "../controllers/reviewController.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post(
  "/scheduled",
  roleMiddleware(["line head"]),
  reviewController.createScheduled
);
router.post(
  "/solved",
  roleMiddleware(["line head"]),
  reviewController.createSolved
);
router.post(
  "/rejected",
  roleMiddleware(["line head", "section head"]),
  reviewController.createRejected
);
router.post(
  "/section-suggestion",
  roleMiddleware(["line head", "section head"]),
  reviewController.createSectionSuggestion
);

export default router;
