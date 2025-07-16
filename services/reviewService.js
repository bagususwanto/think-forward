import { sequelize, Review, Submission } from "../models/index.js";
import {
  reviewScheduledSchema,
  reviewSolvedSchema,
  reviewRejectedSchema,
  reviewSectionSuggestionSchema,
} from "../schemas/reviewSchema.js";
import { getUserIdsByOrganization } from "./externalAPIService.js";
import { logAction } from "./logService.js";

function validateReviewScheduled(data) {
  const { error } = reviewScheduledSchema.validate(data, {
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

function validateReviewSectionSuggestion(data) {
  const { error } = reviewSectionSuggestionSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const err = new Error("Validation error");
    err.details = error.details.map((d) => d.message);
    throw err;
  }
}

export default {
  async createScheduled(data, req) {
    validateReviewScheduled(data);
    const userId = req.user.userId;
    const userdIdsOrganization = await getUserIdsByOrganization();
    const submission = await Submission.findByPk(data.submissionId);

    // check if user is in organization
    if (!userdIdsOrganization.includes(submission.userId)) {
      throw new Error("User is not in organization");
    }

    // check if submission exists
    if (!submission) {
      throw new Error("Submission not found");
    }

    // check if submission is pending
    if (submission.status !== 0) {
      throw new Error("Submission is not pending");
    }

    // check if submission is already scheduled
    if (submission.status === 1) {
      throw new Error("Submission is already scheduled");
    }

    // create review
    return sequelize.transaction(async () => {
      const review = await Review.create({
        ...data,
        submissionId: submission.id,
        feedback: "scheduled",
        actionPic: data.actionPic,
        thirdParty: data.thirdParty,
        actionPlan: data.actionPlan,
        actionDate: data.actionDate,
        suggestion: data.suggestion,
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
    const userId = req.user.userId;
    const userdIdsOrganization = await getUserIdsByOrganization();
    const submission = await Submission.findByPk(data.submissionId);

    // check if user is in organization
    if (!userdIdsOrganization.includes(submission.userId)) {
      throw new Error("User is not in organization");
    }

    // check if submission exists
    if (!submission) {
      throw new Error("Submission not found");
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
        submissionId: submission.id,
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
    const userId = req.user.userId;
    const userdIdsOrganization = await getUserIdsByOrganization();
    const submission = await Submission.findByPk(data.submissionId);

    // check if user is in organization
    if (!userdIdsOrganization.includes(submission.userId)) {
      throw new Error("User is not in organization");
    }

    // check if submission exists
    if (!submission) {
      throw new Error("Submission not found");
    }

    // check if submission is already rejected
    if (submission.status === 4) {
      throw new Error("Submission is already rejected");
    }

    // create review
    return sequelize.transaction(async () => {
      const review = await Review.create({
        ...data,
        submissionId: submission.id,
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
  async createSectionSuggestion(data, req) {
    validateReviewSectionSuggestion(data);
    const userId = req.user.userId;
    const userdIdsOrganization = await getUserIdsByOrganization();
    const submission = await Submission.findByPk(data.submissionId);

    // check if user is in organization
    if (!userdIdsOrganization.includes(submission.userId)) {
      throw new Error("User is not in organization");
    }

    // check if submission exists
    if (!submission) {
      throw new Error("Submission not found");
    }

    // check if submission is solved
    if (submission.status !== 2) {
      throw new Error("Submission is not solved");
    }

    // check if submission is already section suggestion
    if (submission.status === 3) {
      throw new Error("Submission is already section suggestion");
    }

    // create review
    return sequelize.transaction(async () => {
      const review = await Review.create({
        ...data,
        submissionId: submission.id,
        feedback: "section suggestion",
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
