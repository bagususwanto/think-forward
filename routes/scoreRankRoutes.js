import express from "express";
import scoreRankController from "../controllers/scoreRankController.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import verifyTokenExternal from "../middlewares/verifyTokenExternal.js";

const router = express.Router();

router.use(verifyTokenExternal);
router.use(roleMiddleware(["super admin"]));

router.post("/", scoreRankController.create);
router.get("/", scoreRankController.findAll);
router.get("/:id", scoreRankController.findById);
router.patch("/:id", scoreRankController.update);
router.delete("/:id", scoreRankController.delete);

export default router;
