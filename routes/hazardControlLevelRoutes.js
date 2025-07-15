import express from "express";
import hazardControlLevelController from "../controllers/hazardControlLevelController.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  roleMiddleware(["super admin"]),
  hazardControlLevelController.create
);
router.get(
  "/",
  roleMiddleware(["super admin"]),
  hazardControlLevelController.findAll
);
router.get(
  "/:id",
  roleMiddleware(["super admin"]),
  hazardControlLevelController.findById
);
router.patch(
  "/:id",
  roleMiddleware(["super admin"]),
  hazardControlLevelController.update
);
router.delete(
  "/:id",
  roleMiddleware(["super admin"]),
  hazardControlLevelController.delete
);

export default router;
