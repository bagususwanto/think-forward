import express from "express";
import workingFrequencyController from "../controllers/workingFrequencyController.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import verifyTokenExternal from "../middlewares/verifyTokenExternal.js";

const router = express.Router();

router.use(verifyTokenExternal);
router.use(roleMiddleware(["super admin"]));

router.post("/", workingFrequencyController.create);
router.get("/", workingFrequencyController.findAll);
router.get("/:id", workingFrequencyController.findById);
router.patch("/:id", workingFrequencyController.update);
router.delete("/:id", workingFrequencyController.delete);

export default router;
