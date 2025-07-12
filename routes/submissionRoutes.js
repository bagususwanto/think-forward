import express from "express";
import submissionController from "../controllers/submissionController.js";

const router = express.Router();

router.post("/", submissionController.create);
router.get("/", submissionController.findAll);
router.get("/:id", submissionController.findById);
router.put("/:id", submissionController.update);

export default router;
