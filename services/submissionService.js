import { Submission, sequelize } from "../models/index.js";
import {
  submissionCreateSchema,
  submissionUpdateSchema,
} from "../schemas/submissionSchema.js";
import { logAction } from "./logService.js";
import hazardAssessmentService from "./hazardAssessmentService.js";
import hazardReportService from "./hazardReportService.js";
import hazardEvaluationService from "./hazardEvaluationService.js";

function validateSubmissionCreate(data) {
  const { error } = submissionCreateSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const err = new Error("Validation error");
    err.details = error.details.map((d) => d.message);
    throw err;
  }
}

function validateSubmissionUpdate(data) {
  const { error } = submissionUpdateSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const err = new Error("Validation error");
    err.details = error.details.map((d) => d.message);
    throw err;
  }
}

export default {
  async create(data, req) {
    validateSubmissionCreate(data.submission);
    const userId = req.user.userId;
    return sequelize.transaction(async () => {
      const submission = await Submission.create({
        ...data.submission,
        userId,
        status: "waiting review",
      });

      // create hazard assessment
      await hazardAssessmentService.create(data.hazardAssessment, submission.id, userId);

      // create hazard report
      await hazardReportService.create(data.hazardReport, submission.id, userId);

      // create hazard evaluation
      await hazardEvaluationService.create(
        data.hazardEvaluation,
        submission.id,
        userId,
      );

      await logAction({
        userId,
        action: "create",
        entity: "Submission",
        entityId: submission.id,
        previousData: null,
        newData: submission.toJSON(),
      });
      return submission;
    });
  },
  async findAll() {
    return Submission.findAll();
  },
  async findById(id) {
    return Submission.findByPk(id);
  },
  async update(id, data, req) {
    validateSubmissionUpdate(data);
    const userId = req.user.userId;
    return sequelize.transaction(async () => {
      const submission = await Submission.findByPk(id);
      if (!submission) throw new Error("Submission not found");
      const previousData = submission.toJSON();
      const updated = await submission.update({
        ...data,
        userId,
      });
      await logAction({
        userId,
        action: "update",
        entity: "Submission",
        entityId: id,
        previousData,
        newData: updated.toJSON(),
      });
      return updated;
    });
  },
};
