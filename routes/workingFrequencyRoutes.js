import express from "express";
import workingFrequencyController from "../controllers/workingFrequencyController.js";

const router = express.Router();

router.post("/", workingFrequencyController.create);
router.get("/", workingFrequencyController.findAll);
router.get("/:id", workingFrequencyController.findById);
router.patch("/:id", workingFrequencyController.update);
router.delete("/:id", workingFrequencyController.delete);

export default router;
