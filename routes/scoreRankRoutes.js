import express from "express";
import scoreRankController from "../controllers/scoreRankController.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", roleMiddleware(["super admin"]), scoreRankController.create);
router.get("/", roleMiddleware(["super admin"]), scoreRankController.findAll);
router.get(
  "/:id",
  roleMiddleware(["super admin"]),
  scoreRankController.findById
);
router.patch(
  "/:id",
  roleMiddleware(["super admin"]),
  scoreRankController.update
);
router.delete(
  "/:id",
  roleMiddleware(["super admin"]),
  scoreRankController.delete
);

export default router;
