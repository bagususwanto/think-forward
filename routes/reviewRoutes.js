import express from "express";
import reviewController from "../controllers/reviewController.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post(
  "/plan",
  roleMiddleware(["line head"]),
  reviewController.createScheduled
);
router.post(
  "/solve",
  roleMiddleware(["line head"]),
  reviewController.createSolved
);
router.post(
  "/reject",
  roleMiddleware(["line head", "section head"]),
  reviewController.createRejected
);
router.post(
  "/section-suggestion",
  roleMiddleware(["line head", "section head"]),
  reviewController.createSectionSuggestion
);

export default router;
