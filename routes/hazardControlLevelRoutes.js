import express from "express";
import hazardControlLevelController from "../controllers/hazardControlLevelController.js";

const router = express.Router();

router.post("/", hazardControlLevelController.create);
router.get("/", hazardControlLevelController.findAll);
router.get("/:id", hazardControlLevelController.findById);
router.patch("/:id", hazardControlLevelController.update);
router.delete("/:id", hazardControlLevelController.delete);

export default router;
