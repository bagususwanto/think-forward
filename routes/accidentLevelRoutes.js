import express from "express";
import accidentLevelController from "../controllers/accidentLevelController.js";

const router = express.Router();

router.post("/", accidentLevelController.create);
router.get("/", accidentLevelController.findAll);
router.get("/:id", accidentLevelController.findById);
router.patch("/:id", accidentLevelController.update);
router.delete("/:id", accidentLevelController.delete);

export default router;
