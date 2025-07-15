import express from "express";
import accidentLevelController from "../controllers/accidentLevelController.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  roleMiddleware(["super admin"]),
  accidentLevelController.create
);
router.get(
  "/",
  roleMiddleware(["super admin"]),
  accidentLevelController.findAll
);
router.get(
  "/:id",
  roleMiddleware(["super admin"]),
  accidentLevelController.findById
);
router.patch(
  "/:id",
  roleMiddleware(["super admin"]),
  accidentLevelController.update
);
router.delete(
  "/:id",
  roleMiddleware(["super admin"]),
  accidentLevelController.delete
);

export default router;
