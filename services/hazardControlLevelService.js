import { HazardControlLevel, sequelize, Op } from "../models/index.js";
import {
  hazardControlLevelCreateSchema,
  hazardControlLevelUpdateSchema,
} from "../schemas/hazardControlLevelSchema.js";
import { logAction } from "./logService.js";
import { getUserByIds } from "./externalAPIService.js";

function validateHazardControlLevelCreate(data) {
  const { error } = hazardControlLevelCreateSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const err = new Error("Validation error");
    err.details = error.details.map((d) => d.message);
    throw err;
  }
}

function validateHazardControlLevelUpdate(data) {
  const { error } = hazardControlLevelUpdateSchema.validate(data, {
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
    validateHazardControlLevelCreate(data);
    const userId = req.user.userId;
    data.createdBy = userId;
    return sequelize.transaction(async () => {
      const hazardControlLevel = await HazardControlLevel.create({
        ...data,
      });
      await logAction({
        userId,
        action: "create",
        entity: "HazardControlLevel",
        entityId: hazardControlLevel.id,
        newData: hazardControlLevel.toJSON(),
        req,
      });
      return hazardControlLevel;
    });
  },
  async findAll({ page = 1, limit = 10, q = "" } = {}) {
    const offset = (page - 1) * limit;
    const where = {};
    if (q) {
      const or = [{ option: { [Op.like]: `%${q}%` } }];
      if (!isNaN(q)) {
        or.push({ score: Number(q) });
      }
      where[Op.or] = or;
    }
    const { count, rows } = await HazardControlLevel.findAndCountAll({
      limit,
      offset,
      order: [["id", "ASC"]],
      where,
    });
    if (!rows || rows.length === 0) {
      const err = new Error("Data not found");
      err.status = 404;
      throw err;
    }
    const userIds = rows.map(
      (hazardControlLevel) => hazardControlLevel.createdBy
    );
    const users = await getUserByIds(userIds);
    const data = rows.map((hazardControlLevel) => ({
      ...hazardControlLevel.toJSON(),
      createdBy:
        users.find((user) => user.id === hazardControlLevel.createdBy) || null,
      updatedBy:
        users.find((user) => user.id === hazardControlLevel.updatedBy) || null,
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
    const hazardControlLevel = await HazardControlLevel.findByPk(id);
    const userIds = [hazardControlLevel.createdBy];
    const users = await getUserByIds(userIds);
    return {
      ...hazardControlLevel.toJSON(),
      createdBy:
        users.find((user) => user.id === hazardControlLevel.createdBy) || null,
      updatedBy:
        users.find((user) => user.id === hazardControlLevel.updatedBy) || null,
    };
  },
  async update(id, data, req) {
    validateHazardControlLevelUpdate(data);
    const userId = req.user.userId;
    const hazardControlLevel = await HazardControlLevel.findByPk(id);
    if (!hazardControlLevel) throw new Error("HazardControlLevel not found");
    data.updatedBy = userId;
    return sequelize.transaction(async () => {
      const updated = await hazardControlLevel.update(data);
      await logAction({
        userId,
        action: "update",
        entity: "HazardControlLevel",
        entityId: id,
        previousData: hazardControlLevel.toJSON(),
        newData: updated.toJSON(),
        req,
      });
      return updated;
    });
  },
  async delete(id, req) {
    const userId = req.user.userId;
    const hazardControlLevel = await HazardControlLevel.findByPk(id);
    if (!hazardControlLevel) return null;
    return sequelize.transaction(async () => {
      await hazardControlLevel.destroy();
      await logAction({
        userId,
        action: "delete",
        entity: "HazardControlLevel",
        entityId: id,
        previousData: hazardControlLevel.toJSON(),
        newData: null,
        req,
      });
      return hazardControlLevel;
    });
  },
};
