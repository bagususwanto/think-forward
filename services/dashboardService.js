import {
  HazardAssessment,
  HazardEvaluation,
  HazardReport,
  Op,
  sequelize,
  Submission,
} from "../models/index.js";
import {
  getLineByIds,
  getSectionByIds,
  getUserByIds,
  getUserIdsByNoregOrName,
} from "./externalAPIService.js";

export default {
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
      data: { ...result, total },
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
  async findAllRecent({ page = 1, limit = 10, q = "", req } = {}) {
    const sectionId = req.user.sectionId;
    const offset = (page - 1) * limit;
    const where = {
      sectionId,
    };

    if (q) {
      const userIds = await getUserIdsByNoregOrName(q);
      where.userId = {
        [Op.in]: userIds,
      };
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
      order: [["id", "DESC"]],
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
      user: users.find((user) => user.id === submission.userId) || null,
      line: lines.find((line) => line.id === submission.lineId) || null,
      section:
        sections.find((section) => section.id === submission.sectionId) || null,
    }));
    return {
      data,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      limit,
    };
  },
};
