import express from "express";
import submissionController from "../controllers/submissionController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.single("image"), submissionController.create);
router.get("/", submissionController.findAll);
router.get("/:id", submissionController.findById);
router.get("/reviews", submissionController.findByUserIds);
router.patch("/:id", submissionController.update);

export default router;
