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
  async create(data) {
    validateSubmissionCreate(data.submission);
    const userId = data.submission.userId;
    return sequelize.transaction(async () => {
      // Generate nomor urut harian
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const dateStr = `${year}${month}${day}`;

      // Cari submission terakhir hari ini
      const lastSubmission = await Submission.findOne({
        where: sequelize.where(
          sequelize.fn("DATE", sequelize.col("createdAt")),
          "=",
          `${year}-${month}-${day}`
        ),
        order: [["submissionNumber", "DESC"]],
      });

      let nextNumber = 1;
      if (lastSubmission && lastSubmission.submissionNumber) {
        // Ambil urutan terakhir dari format SUB-YYYYMMDD-XXX
        const match =
          lastSubmission.submissionNumber.match(/SUB-\d{8}-(\d{3})$/);
        if (match) {
          nextNumber = parseInt(match[1], 10) + 1;
        }
      }

      const submissionNumber = `SUB-${dateStr}-${String(nextNumber).padStart(
        3,
        "0"
      )}`;

      const submission = await Submission.create({
        ...data.submission,
        userId,
        status: 0,
        submissionNumber,
      });

      if (data.submission.type === "hyarihatto") {
        // create hazard assessment
        await hazardAssessmentService.create(
          data.hazardAssessment,
          submission.id,
          userId
        );

        // create hazard report
        await hazardReportService.create(
          data.hazardReport,
          submission.id,
          userId
        );

        // create hazard evaluation
        await hazardEvaluationService.create(
          data.hazardEvaluation,
          submission.id,
          userId
        );
      }

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
