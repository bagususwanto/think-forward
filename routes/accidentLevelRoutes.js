import express from "express";
import accidentLevelController from "../controllers/accidentLevelController.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import verifyTokenExternal from "../middlewares/verifyTokenExternal.js";

const router = express.Router();

router.use(verifyTokenExternal);
router.use(roleMiddleware(["super admin"]));

router.post("/", accidentLevelController.create);
router.get("/", accidentLevelController.findAll);
router.get("/:id", accidentLevelController.findById);
router.patch("/:id", accidentLevelController.update);
router.delete("/:id", accidentLevelController.delete);

export default router;
