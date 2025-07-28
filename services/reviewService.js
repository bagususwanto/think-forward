import { sequelize, Review, Submission } from "../models/index.js";
import {
  reviewCounterMeasureSchema,
  reviewSolvedSchema,
  reviewRejectedSchema,
} from "../schemas/reviewSchema.js";
import { logAction } from "./logService.js";

function validateReviewCounterMeasure(data) {
  const { error } = reviewCounterMeasureSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const err = new Error("Validation error");
    err.details = error.details.map((d) => d.message);
    throw err;
  }
}

function validateReviewSolved(data) {
  const { error } = reviewSolvedSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const err = new Error("Validation error");
    err.details = error.details.map((d) => d.message);
    throw err;
  }
}

function validateReviewRejected(data) {
  const { error } = reviewRejectedSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const err = new Error("Validation error");
    err.details = error.details.map((d) => d.message);
    throw err;
  }
}

export default {
  async createCounterMeasure(data, req) {
    validateReviewCounterMeasure(data);
    const { userId, roleName, lineId, sectionId } = req.user;

    // check if submission exists
    const submission = await Submission.findByPk(data.submissionId);

    // check if submission exists
    if (!submission) {
      throw new Error("Submission not found");
    }

    // check if user is in organization
    if (roleName === "line head" && submission.lineId !== lineId) {
      throw new Error("You are not in the correct organization");
    }
    if (roleName === "section head" && submission.sectionId !== sectionId) {
      throw new Error("You are not in the correct organization");
    }

    // check if submission is pending
    if (submission.status !== 0) {
      throw new Error("Submission is not pending");
    }

    // check if submission is already counter-measured
    if (submission.status === 1) {
      throw new Error("Submission is already counter-measured");
    }

    // create review
    return sequelize.transaction(async () => {
      const review = await Review.create({
        ...data,
        feedback: "counter-measured",
        userId,
      });

      // update submission status
      await submission.update({
        status: 1,
      });

      await logAction({
        userId,
        action: "create",
        entity: "Review",
        entityId: review.id,
        previousData: null,
        newData: review.toJSON(),
        req,
      });
      return review;
    });
  },
  async createSolved(data, req) {
    validateReviewSolved(data);
    const { userId, roleName, lineId, sectionId } = req.user;
    const submission = await Submission.findByPk(data.submissionId);

    // check if submission exists
    if (!submission) {
      throw new Error("Submission not found");
    }

    // check if user is in organization
    if (roleName === "line head" && submission.lineId !== lineId) {
      throw new Error("You are not in the correct organization");
    }
    if (roleName === "section head" && submission.sectionId !== sectionId) {
      throw new Error("You are not in the correct organization");
    }

    // check if submission is scheduled
    if (submission.status !== 1) {
      throw new Error("Submission is not scheduled");
    }

    // check if submission is already solved
    if (submission.status === 2) {
      throw new Error("Submission is already solved");
    }

    // create review
    return sequelize.transaction(async () => {
      const review = await Review.create({
        ...data,
        feedback: "solved",
        proof: data.proof,
        userId,
      });

      // update submission status
      await submission.update({
        status: 2,
      });

      await logAction({
        userId,
        action: "create",
        entity: "Review",
        entityId: review.id,
        previousData: null,
        newData: review.toJSON(),
        req,
      });
      return review;
    });
  },
  async createRejected(data, req) {
    validateReviewRejected(data);
    const { userId, roleName, lineId, sectionId } = req.user;
    const submission = await Submission.findByPk(data.submissionId);

    // check if submission exists
    if (!submission) {
      throw new Error("Submission not found");
    }

    // check if user is in organization
    if (roleName === "line head" && submission.lineId !== lineId) {
      throw new Error("You are not in the correct organization");
    }
    if (roleName === "section head" && submission.sectionId !== sectionId) {
      throw new Error("You are not in the correct organization");
    }

    // check if submission is already rejected
    if (submission.status === 3) {
      throw new Error("Submission is already rejected");
    }

    // check if submission is solved
    if (submission.status === 2) {
      throw new Error("Submission is already solved");
    }

    // create review
    return sequelize.transaction(async () => {
      const review = await Review.create({
        ...data,
        feedback: "rejected",
        suggestion: data.suggestion,
        userId,
      });

      // update submission status
      await submission.update({
        status: 3,
      });

      await logAction({
        userId,
        action: "create",
        entity: "Review",
        entityId: review.id,
        previousData: null,
        newData: review.toJSON(),
        req,
      });
      return review;
    });
  },
};
