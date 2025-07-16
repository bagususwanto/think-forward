import { WorkingFrequency, sequelize } from "../models/index.js";
import {
  workingFrequencyCreateSchema,
  workingFrequencyUpdateSchema,
} from "../schemas/workingFrequencySchema.js";
import { logAction } from "./logService.js";
import { getUserByIds } from "./externalAPIService.js";

function validateWorkingFrequencyCreate(data) {
  const { error } = workingFrequencyCreateSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const err = new Error("Validation error");
    err.details = error.details.map((d) => d.message);
    throw err;
  }
}

function validateWorkingFrequencyUpdate(data) {
  const { error } = workingFrequencyUpdateSchema.validate(data, {
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
    validateWorkingFrequencyCreate(data);
    const userId = req.user.userId;
    data.createdBy = userId;
    return sequelize.transaction(async () => {
      const workingFrequency = await WorkingFrequency.create({
        ...data,
      });
      await logAction({
        userId,
        action: "create",
        entity: "WorkingFrequency",
        entityId: workingFrequency.id,
        newData: workingFrequency.toJSON(),
        req,
      });
      return workingFrequency;
    });
  },
  async findAll({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const { count, rows } = await WorkingFrequency.findAndCountAll({
      limit,
      offset,
      order: [["id", "ASC"]],
    });
    const userIds = rows.map((wf) => wf.createdBy);
    const users = await getUserByIds(userIds);
    const data = rows.map((wf) => ({
      ...wf.toJSON(),
      createdBy: users.find((user) => user.id === wf.createdBy) || null,
      updatedBy: users.find((user) => user.id === wf.updatedBy) || null,
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
    const workingFrequency = await WorkingFrequency.findByPk(id);
    const userIds = [workingFrequency.createdBy];
    const users = await getUserByIds(userIds);
    return {
      ...workingFrequency.toJSON(),
      createdBy:
        users.find((user) => user.id === workingFrequency.createdBy) || null,
      updatedBy:
        users.find((user) => user.id === workingFrequency.updatedBy) || null,
    };
  },
  async update(id, data, req) {
    validateWorkingFrequencyUpdate(data);
    const userId = req.user.userId;
    const workingFrequency = await WorkingFrequency.findByPk(id);
    if (!workingFrequency) throw new Error("WorkingFrequency not found");
    data.updatedBy = userId;
    return sequelize.transaction(async () => {
      const updated = await workingFrequency.update(data);
      await logAction({
        userId,
        action: "update",
        entity: "WorkingFrequency",
        entityId: id,
        previousData: workingFrequency.toJSON(),
        newData: updated.toJSON(),
        req,
      });
      return updated;
    });
  },
  async delete(id, req) {
    const userId = req.user.userId;
    const workingFrequency = await WorkingFrequency.findByPk(id);
    if (!workingFrequency) return null;
    return sequelize.transaction(async () => {
      await workingFrequency.destroy();
      await logAction({
        userId,
        action: "delete",
        entity: "WorkingFrequency",
        entityId: id,
        previousData: workingFrequency.toJSON(),
        newData: null,
        req,
      });
      return workingFrequency;
    });
  },
};
