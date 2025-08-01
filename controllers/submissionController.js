import submissionService from "../services/submissionService.js";
import { successResponse } from "../middlewares/successResponse.js";
import fs from "fs";

export default {
  async create(req, res, next) {
    try {
      const submission = await submissionService.create(req.body, req);
      return successResponse(res, {
        message: "Submission created successfully",
        data: submission,
        status: 201,
      });
    } catch (err) {
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.error("Gagal hapus file:", unlinkErr);
        });
      }
      next(err);
    }
  },
  async findAll(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const query = req.query || "";
      const result = await submissionService.findAll({
        page,
        limit,
        query,
        req,
      });
      return successResponse(res, {
        message: "List of recent submissions",
        data: result.data,
        meta: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          limit: result.limit,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  async findById(req, res, next) {
    try {
      const submission = await submissionService.findById(req.params.id);
      if (!submission)
        return res
          .status(404)
          .json({ success: false, message: "Submission not found" });
      return successResponse(res, {
        message: "Submission detail",
        data: submission,
      });
    } catch (err) {
      next(err);
    }
  },
  async findByOrganization(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const query = req.query || "";
      const submissions = await submissionService.findByOrganization(req, {
        page,
        limit,
        query,
      });
      return successResponse(res, {
        message: "List of submissions organization",
        data: submissions.data,
        meta: {
          total: submissions.total,
          page: submissions.page,
          totalPages: submissions.totalPages,
          limit: submissions.limit,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  async update(req, res, next) {
    try {
      const updated = await submissionService.update(
        req.params.id,
        req.body,
        req
      );
      return successResponse(res, {
        message: "Submission updated successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },
  async findAllGroupedByUserId(req, res, next) {
    try {
      const query = req.query || "";
      const result = await submissionService.findAllGroupedByUserId(req, query);
      return successResponse(res, {
        message: "Submission grouped by user retrieved successfully",
        data: result.data,
        // meta: {
        //   total: submissions.total,
        //   page: submissions.page,
        //   totalPages: submissions.totalPages,
        //   limit: submissions.limit,
        // },
      });
    } catch (err) {
      next(err);
    }
  },
};
