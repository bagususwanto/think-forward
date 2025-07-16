import {
  Submission,
  sequelize,
  Op,
  HazardAssessment,
  HazardReport,
  HazardEvaluation,
} from "../models/index.js";
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
    const userId = data.submission.userId;
    return sequelize.transaction(async () => {
      // Generate nomor urut harian
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const dateStr = `${year}${month}${day}`;

      // Cari submission terakhir hari ini
      const startOfDay = new Date(`${year}-${month}-${day}T00:00:00`);
      const endOfDay = new Date(`${year}-${month}-${day}T23:59:59`);

      const lastSubmission = await Submission.findOne({
        where: {
          createdAt: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
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
          userId,
          req
        );

        // create hazard report
        await hazardReportService.create(
          data.hazardReport,
          submission.id,
          userId,
          req
        );

        // create hazard evaluation
        await hazardEvaluationService.create(
          data.hazardEvaluation,
          submission.id,
          userId,
          req
        );
      }

      await logAction({
        userId,
        action: "create",
        entity: "Submission",
        entityId: submission.id,
        previousData: null,
        newData: submission.toJSON(),
        req,
      });
      return {
        submission,
        hazardAssessment: submission.hazardAssessment,
        hazardReport: submission.hazardReport,
        hazardEvaluation: submission.hazardEvaluation,
      };
    });
  },
  async findAll() {
    return Submission.findAll();
  },
  async findById(id) {
    return Submission.findByPk(id);
  },
  async findByUserIds(userIds, { page = 1, limit = 10, q = "" } = {}) {
    const offset = (page - 1) * limit;
    const where = {
      userId: { [Op.in]: userIds },
    };
    if (q) {
      const or = [
        { submissionNumber: { [Op.like]: `%${q}%` } },
        { type: { [Op.like]: `%${q}%` } },
        { shift: { [Op.like]: `%${q}%` } },
        { workProcess: { [Op.like]: `%${q}%` } },
        { location: { [Op.like]: `%${q}%` } },
      ];
      // Cek jika q adalah tanggal valid (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}$/.test(q)) {
        or.push({ incidentDate: q });
      }
      where[Op.and] = [where, { [Op.or]: or }];
    }
    const { count, rows } = await Submission.findAndCountAll({
      where,
      include: [
        {
          model: HazardAssessment,
        },
        {
          model: HazardReport,
        },
        {
          model: HazardEvaluation,
        },
      ],
      limit,
      offset,
      order: [["status", "ASC"]],
    });
    if (!rows || rows.length === 0) {
      const err = new Error("Data not found");
      err.status = 404;
      throw err;
    }
    const users = await getUserByIds(userIds);

    const submissions = rows.map((submission) => ({
      ...submission.toJSON(),
      hazardAssessment: submission.hazardAssessment,
      hazardReport: submission.hazardReport,
      hazardEvaluation: submission.hazardEvaluation,
      user: users.find((user) => user.id === submission.userId) || null,
    }));
    return {
      data: submissions,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      limit,
    };
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
