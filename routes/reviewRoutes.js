import express from "express";
import reviewController from "../controllers/reviewController.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import verifyTokenExternal from "../middlewares/verifyTokenExternal.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.use(verifyTokenExternal);

router.post(
  "/counter-measure",
  roleMiddleware(["line head", "section head"]),
  reviewController.createCounterMeasure
);
router.post(
  "/solve",
  roleMiddleware(["line head", "section head"]),
  upload.single("image"),
  reviewController.createSolved
);
router.post(
  "/reject",
  roleMiddleware(["line head", "section head"]),
  reviewController.createRejected
);
router.post(
  "/section-suggestion",
  roleMiddleware(["section head"]),
  reviewController.createSectionSuggestion
);

export default router;
