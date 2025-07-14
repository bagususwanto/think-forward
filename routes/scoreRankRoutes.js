import express from "express";
import scoreRankController from "../controllers/scoreRankController.js";

const router = express.Router();

router.post("/", scoreRankController.create);
router.get("/", scoreRankController.findAll);
router.get("/:id", scoreRankController.findById);
router.patch("/:id", scoreRankController.update);
router.delete("/:id", scoreRankController.delete);

export default router;
