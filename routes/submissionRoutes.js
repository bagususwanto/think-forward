import express from "express";
import submissionController from "../controllers/submissionController.js";
import upload from "../middlewares/uploadMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import verifyTokenExternal from "../middlewares/verifyTokenExternal.js";

const router = express.Router();

router.post("/", upload.single("image"), submissionController.create);
router.get("/", verifyTokenExternal, submissionController.findAll);
router.get(
  "/reviews",
  verifyTokenExternal,
  roleMiddleware(["group head", "line head", "section head"]),
  submissionController.findByOrganization
);
router.get("/:id", submissionController.findById);
router.patch("/:id", submissionController.update);

export default router;
