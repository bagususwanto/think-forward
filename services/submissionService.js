import {
  Submission,
  sequelize,
  Op,
  HazardAssessment,
  HazardReport,
  HazardEvaluation,
  Review,
} from "../models/index.js";
import {
  submissionCreateSchema,
  submissionUpdateSchema,
} from "../schemas/submissionSchema.js";
import { logAction } from "./logService.js";
import hazardAssessmentService from "./hazardAssessmentService.js";
import hazardReportService from "./hazardReportService.js";
import hazardEvaluationService from "./hazardEvaluationService.js";
import {
  checkLineId,
  checkSectionId,
  checkUserId,
  getLineByIds,
  getSectionByIds,
  getUserByIds,
  getUserIdsByNoregOrName,
} from "./externalAPIService.js";
import voiceMemberService from "./voiceMemberService.js";

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
    const dataParsed = JSON.parse(data.data);
    validateSubmissionCreate(dataParsed.submission);
    const userId = dataParsed.submission.userId;

    // Check if user exists
    const user = await checkUserId(userId);
    if (user.status === false) throw new Error("User not found");

    // Check if lineId and sectionId are valid
    if (dataParsed.submission.lineId) {
      const line = await checkLineId(dataParsed.submission.lineId);
      if (line.status === false) throw new Error("Line not found");
    }
    const section = await checkSectionId(dataParsed.submission.sectionId);
    if (section.status === false) throw new Error("Section not found");

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
        ...dataParsed.submission,
        status: 0,
        submissionNumber,
      });

      if (dataParsed.submission.type === "hyarihatto") {
        // create hazard assessment
        await hazardAssessmentService.create(
          dataParsed.hazardAssessment,
          submission.id,
          userId,
          req
        );

        // create hazard report
        await hazardReportService.create(
          dataParsed.hazardReport,
          submission.id,
          userId,
          req
        );

        // create hazard evaluation
        await hazardEvaluationService.create(
          dataParsed.hazardEvaluation,
          submission.id,
          userId,
          req
        );
      } else if (dataParsed.submission.type === "voice member") {
        // create voice member
        await voiceMemberService.create(
          dataParsed.voiceMember,
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
  async findAll({ page = 1, limit = 10, query = "", order = "", req } = {}) {
    const { sectionId, lineId, roleName } = req.user || null;
    const { type, status, year, month, q } = query;
    const sectionIdQuery = query.sectionId;
    const lineIdQuery = query.lineId;
    const offset = (page - 1) * limit;
    let whereCondition = {};

    if (type) {
      whereCondition.type = type;
    }

    if (status) {
      whereCondition.status = status;
    }

    if (
      roleName === "section head" ||
      roleName === "line head" ||
      roleName === "group head"
    ) {
      if (sectionId) {
        whereCondition.sectionId = sectionId;
      }

      if (lineId) {
        whereCondition.lineId = lineId;
      }
    }

    if (sectionIdQuery) {
      whereCondition.sectionId = sectionIdQuery;
    }
    if (lineIdQuery) {
      whereCondition.lineId = lineIdQuery;
    }

    // Tambahkan kondisi untuk tahun dan bulan jika ada
    if (year) {
      whereCondition.incidentDate = {
        [Op.gte]: new Date(`${year}-01-01`),
        [Op.lte]: new Date(`${year}-12-31`),
      };
    }
    if (month) {
      whereCondition.incidentDate = {
        [Op.gte]: new Date(`${year}-${month}-01`),
        [Op.lte]: new Date(`${year}-${month}-31`),
      };
    }

    if (q) {
      const userIds = await getUserIdsByNoregOrName(q);
      whereCondition.userId = {
        [Op.in]: userIds,
      };
    }

    const { count, rows } = await Submission.findAndCountAll({
      where: whereCondition,
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
      order: [["id", order || "DESC"]],
    });

    if (!rows || rows.length === 0) {
      const err = new Error("Data not found");
      err.status = 404;
      throw err;
    }

    const userIds = rows.map((submission) => submission.userId);
    const lineIds = rows.map((submission) => submission.lineId);
    const sectionIds = rows.map((submission) => submission.sectionId);
    const users = await getUserByIds(userIds);
    const lines = await getLineByIds(lineIds);
    const sections = await getSectionByIds(sectionIds);
    const data = rows.map((submission) => ({
      ...submission.toJSON(),
      line: lines.find((line) => line.id === submission.lineId) || null,
      section:
        sections.find((section) => section.id === submission.sectionId) || null,
      user: users.find((user) => user.id === submission.userId) || null,
    }));
    return {
      data,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      limit,
    };
  },
  async findById(id) {
    const rows = await Submission.findOne({
      where: {
        id,
      },
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
        {
          model: Review,
        },
      ],
    });

    if (!rows || rows.length === 0) {
      const err = new Error("Data not found");
      err.status = 404;
      throw err;
    }

    const userIds = rows.userId ? [rows.userId] : [];
    const lineIds = rows.lineId ? [rows.lineId] : [];
    const sectionIds = rows.sectionId ? [rows.sectionId] : [];
    const users = await getUserByIds(userIds);
    const lines = await getLineByIds(lineIds);
    const sections = await getSectionByIds(sectionIds);
    const data = {
      ...rows.toJSON(),
      line: lines.find((line) => line.id === rows.lineId) || null,
      section:
        sections.find((section) => section.id === rows.sectionId) || null,
      user: users.find((user) => user.id === rows.userId) || null,
    };
    return data;
  },
  async findByOrganization(req, { page = 1, limit = 10, query } = {}) {
    const { lineId, sectionId, roleName } = req.user;
    const { type, q } = query;
    let whereCondition = {
      type: type || "",
    };

    // jika roleName adalah group head dan line head
    if (roleName === "group head" || roleName === "line head") {
      whereCondition.lineId = lineId;
    }

    // jika roleName adalah section head
    if (roleName === "section head") {
      whereCondition.sectionId = sectionId;
    }

    if (q) {
      const userIds = await getUserIdsByNoregOrName(q);
      whereCondition.userId = {
        [Op.in]: userIds,
      };
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Submission.findAndCountAll({
      where: whereCondition,
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
      order: [
        ["status", "ASC"],
        ["id", "ASC"],
      ],
    });

    const userIds = rows.map((submission) => submission.userId);
    const lineIds = rows.map((submission) => submission.lineId);
    const sectionIds = rows.map((submission) => submission.sectionId);
    const users = await getUserByIds(userIds);
    const lines = await getLineByIds(lineIds);
    const sections = await getSectionByIds(sectionIds);

    const submissions = rows.map((submission) => ({
      ...submission.toJSON(),
      hazardAssessment: submission.hazardAssessment,
      hazardReport: submission.hazardReport,
      hazardEvaluation: submission.hazardEvaluation,
      user: users.find((user) => user.id === submission.userId) || null,
      line: lines.find((line) => line.id === submission.lineId) || null,
      section:
        sections.find((section) => section.id === submission.sectionId) || null,
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

  async findAllGroupedByStatus(req, q) {
    const sectionId = req.user.sectionId;
    const { type, year, month } = q;
    let whereCondition = {
      type: type || "",
      sectionId,
    };

    // Tambahkan kondisi untuk tahun dan bulan jika ada
    if (year) {
      whereCondition.incidentDate = {
        [Op.gte]: new Date(`${year}-01-01`),
        [Op.lte]: new Date(`${year}-12-31`),
      };
    }
    if (month) {
      whereCondition.incidentDate = {
        [Op.gte]: new Date(`${year}-${month}-01`),
        [Op.lte]: new Date(`${year}-${month}-31`),
      };
    }

    // Hitung total keseluruhan data (tanpa group)
    const total = await Submission.count({
      where: whereCondition,
    });

    const result = await Submission.findAll({
      where: whereCondition,
      attributes: [
        "status",
        [
          Submission.sequelize.fn("COUNT", Submission.sequelize.col("status")),
          "count",
        ],
      ],
      group: ["status"],
    });
    if (!result || result.length === 0) {
      const err = new Error("Data not found");
      err.status = 404;
      throw err;
    }

    return {
      data: { grouped: result, total },
    };
  },
  async findAllGroupedByLine(req, q) {
    const sectionId = req.user.sectionId;
    const { type, year, month } = q;
    let whereCondition = {
      type: type || "",
      sectionId,
    };

    // Tambahkan kondisi untuk tahun dan bulan jika ada
    if (year) {
      whereCondition.incidentDate = {
        [Op.gte]: new Date(`${year}-01-01`),
        [Op.lte]: new Date(`${year}-12-31`),
      };
    }
    if (month) {
      whereCondition.incidentDate = {
        [Op.gte]: new Date(`${year}-${month}-01`),
        [Op.lte]: new Date(`${year}-${month}-31`),
      };
    }

    const result = await Submission.findAll({
      where: whereCondition,
      attributes: [
        "lineId",
        [
          Submission.sequelize.literal("FORMAT(incidentDate, 'yyyy-MM')"),
          "month",
        ],
        [
          Submission.sequelize.fn("COUNT", Submission.sequelize.col("lineId")),
          "count",
        ],
      ],
      group: [
        "lineId",
        Submission.sequelize.literal("FORMAT(incidentDate, 'yyyy-MM')"),
      ],
    });

    if (!result || result.length === 0) {
      const err = new Error("Data not found");
      err.status = 404;
      throw err;
    }

    const lineIds = result.map((item) => item.lineId);
    const lines = await getLineByIds(lineIds);

    const data = result.map((item) => ({
      ...item.toJSON(),
      line: lines.find((line) => line.id === item.lineId) || null,
    }));

    return {
      data,
    };
  },
  async findAllGroupedByAccindentType(req, q) {
    const sectionId = req.user.sectionId;
    const { year, month } = q;
    let whereCondition = {
      sectionId,
    };

    // Tambahkan kondisi untuk tahun dan bulan jika ada
    if (year) {
      whereCondition.incidentDate = {
        [Op.gte]: new Date(`${year}-01-01`),
        [Op.lte]: new Date(`${year}-12-31`),
      };
    }
    if (month) {
      whereCondition.incidentDate = {
        [Op.gte]: new Date(`${year}-${month}-01`),
        [Op.lte]: new Date(`${year}-${month}-31`),
      };
    }

    const result = await Submission.findAll({
      where: whereCondition,
      attributes: [
        [sequelize.col("HazardReport.accidentType"), "accidentType"],
        [
          sequelize.fn("COUNT", sequelize.col("HazardReport.accidentType")),
          "count",
        ],
      ],
      include: [
        {
          model: HazardReport,
          attributes: [], // biar gak muncul duplikat data relasi
          required: true,
        },
      ],
      group: ["HazardReport.accidentType"],
      raw: true,
    });

    if (!result || result.length === 0) {
      const err = new Error("Data not found");
      err.status = 404;
      throw err;
    }

    return {
      data: result,
    };
  },
  async findAllGroupedByUserId(req, query) {
    const sectionId = req.user.sectionId;
    const { type, year, month } = query;
    let whereCondition = {
      type: type || "",
      sectionId,
    };

    // Tambahkan kondisi untuk tahun dan bulan jika ada
    if (year) {
      whereCondition.incidentDate = {
        [Op.gte]: new Date(`${year}-01-01`),
        [Op.lte]: new Date(`${year}-12-31`),
      };
    }
    if (month) {
      whereCondition.incidentDate = {
        [Op.gte]: new Date(`${year}-${month}-01`),
        [Op.lte]: new Date(`${year}-${month}-31`),
      };
    }

    const result = await Submission.findAll({
      where: whereCondition,
      attributes: [
        "userId",
        [
          Submission.sequelize.fn("COUNT", Submission.sequelize.col("userId")),
          "count",
        ],
      ],
      group: ["userId"],
      order: [["count", "DESC"]],
    });

    if (!result || result.length === 0) {
      const err = new Error("Data not found");
      err.status = 404;
      throw err;
    }

    const userIds = result.map((item) => item.userId);
    const users = await getUserByIds(userIds);

    const data = result.map((item) => ({
      ...item.toJSON(),
      user: users.find((user) => user.id === item.userId) || null,
    }));

    return {
      data,
    };
  },
};
