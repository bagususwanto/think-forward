import express from "express";
import workingFrequencyController from "../controllers/workingFrequencyController.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  roleMiddleware(["super admin"]),
  workingFrequencyController.create
);
router.get(
  "/",
  roleMiddleware(["super admin"]),
  workingFrequencyController.findAll
);
router.get(
  "/:id",
  roleMiddleware(["super admin"]),
  workingFrequencyController.findById
);
router.patch(
  "/:id",
  roleMiddleware(["super admin"]),
  workingFrequencyController.update
);
router.delete(
  "/:id",
  roleMiddleware(["super admin"]),
  workingFrequencyController.delete
);

export default router;
