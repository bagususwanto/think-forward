import express from "express";
import hazardControlLevelController from "../controllers/hazardControlLevelController.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import verifyTokenExternal from "../middlewares/verifyTokenExternal.js";

const router = express.Router();

router.use(verifyTokenExternal);
router.use(roleMiddleware(["super admin"]));

router.post("/", hazardControlLevelController.create);
router.get("/", hazardControlLevelController.findAll);
router.get("/:id", hazardControlLevelController.findById);
router.patch("/:id", hazardControlLevelController.update);
router.delete("/:id", hazardControlLevelController.delete);

export default router;
