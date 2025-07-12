import { Submission, sequelize } from "../models/index.js";
import {
  submissionCreateSchema,
  submissionUpdateSchema,
} from "../schemas/submissionSchema.js";
import { logAction } from "./logService.js";

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
    validateSubmissionCreate(data);
    const userId = req.user.userId;
    return sequelize.transaction(async (t) => {
      const submission = await Submission.create(
        {
          ...data,
          userId,
        },
        { transaction: t }
      );
      await logAction({
        userId,
        action: "create",
        entity: "Submission",
        entityId: submission.id,
        previousData: null,
        newData: submission.toJSON(),
        transaction: t,
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
    return sequelize.transaction(async (t) => {
      const submission = await Submission.findByPk(id, { transaction: t });
      if (!submission) throw new Error("Submission not found");
      const previousData = submission.toJSON();
      const updated = await submission.update(
        {
          ...data,
          userId,
        },
        { transaction: t }
      );
      await logAction({
        userId,
        action: "update",
        entity: "Submission",
        entityId: id,
        previousData,
        newData: updated.toJSON(),
        transaction: t,
      });
      return updated;
    });
  },
};
