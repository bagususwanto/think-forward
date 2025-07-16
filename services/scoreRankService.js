import { ScoreRank, sequelize } from "../models/index.js";
import {
  scoreRankCreateSchema,
  scoreRankUpdateSchema,
} from "../schemas/scoreRankSchema.js";
import { logAction } from "./logService.js";
import { getUserByIds } from "./externalAPIService.js";

function validateScoreRankCreate(data) {
  const { error } = scoreRankCreateSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const err = new Error("Validation error");
    err.details = error.details.map((d) => d.message);
    throw err;
  }
}

function validateScoreRankUpdate(data) {
  const { error } = scoreRankUpdateSchema.validate(data, {
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
    validateScoreRankCreate(data);
    const userId = req.user.userId;
    data.createdBy = userId;
    return sequelize.transaction(async () => {
      const scoreRank = await ScoreRank.create({
        ...data,
        rank: data.rank.toUpperCase(),
      });
      await logAction({
        userId,
        action: "create",
        entity: "ScoreRank",
        entityId: scoreRank.id,
        newData: scoreRank.toJSON(),
        req,
      });
      return scoreRank;
    });
  },
  async findAll({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const { count, rows } = await ScoreRank.findAndCountAll({
      limit,
      offset,
      order: [["id", "ASC"]],
    });
    const userIds = rows.map((scoreRank) => scoreRank.createdBy);
    const users = await getUserByIds(userIds);
    const data = rows.map((scoreRank) => ({
      ...scoreRank.toJSON(),
      createdBy: users.find((user) => user.id === scoreRank.createdBy) || null,
      updatedBy: users.find((user) => user.id === scoreRank.updatedBy) || null,
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
    const scoreRank = await ScoreRank.findByPk(id);
    const userIds = [scoreRank.createdBy];
    const users = await getUserByIds(userIds);
    return {
      ...scoreRank.toJSON(),
      createdBy: users.find((user) => user.id === scoreRank.createdBy) || null,
      updatedBy: users.find((user) => user.id === scoreRank.updatedBy) || null,
    };
  },
  async update(id, data, req) {
    validateScoreRankUpdate(data);
    const userId = req.user.userId;
    const scoreRank = await ScoreRank.findByPk(id);
    if (!scoreRank) throw new Error("ScoreRank not found");
    data.updatedBy = userId;
    return sequelize.transaction(async () => {
      const updated = await scoreRank.update(data);
      await logAction({
        userId,
        action: "update",
        entity: "ScoreRank",
        entityId: id,
        previousData: scoreRank.toJSON(),
        newData: updated.toJSON(),
        req,
      });
      return updated;
    });
  },
  async delete(id, req) {
    const userId = req.user.userId;
    const scoreRank = await ScoreRank.findByPk(id);
    if (!scoreRank) return null;
    return sequelize.transaction(async () => {
      await scoreRank.destroy();
      await logAction({
        userId,
        action: "delete",
        entity: "ScoreRank",
        entityId: id,
        previousData: scoreRank.toJSON(),
        newData: null,
        req,
      });
      return scoreRank;
    });
  },
};
