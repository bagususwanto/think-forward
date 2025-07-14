import { AccidentLevel, sequelize } from "../models/index.js";
import {
  accidentLevelCreateSchema,
  accidentLevelUpdateSchema,
} from "../schemas/accidentLevelSchema.js";
import { logAction } from "./logService.js";
import { getUserByIds } from "./externalAPIService.js";

function validateAccidentLevelCreate(data) {
  const { error } = accidentLevelCreateSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const err = new Error("Validation error");
    err.details = error.details.map((d) => d.message);
    throw err;
  }
}

function validateAccidentLevelUpdate(data) {
  const { error } = accidentLevelUpdateSchema.validate(data, {
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
    validateAccidentLevelCreate(data);
    const userId = req.user.userId;
    data.createdBy = userId;
    return sequelize.transaction(async () => {
      const accidentLevel = await AccidentLevel.create({
        ...data,
        rank: data.rank.toUpperCase(),
      });
      await logAction({
        userId,
        action: "create",
        entity: "AccidentLevel",
        entityId: accidentLevel.id,
        newData: accidentLevel.toJSON(),
        req,
      });
      return accidentLevel;
    });
  },
  async findAll() {
    const accidentLevels = await AccidentLevel.findAll();
    const userIds = accidentLevels.map(
      (accidentLevel) => accidentLevel.createdBy
    );
    const users = await getUserByIds(userIds);
    return accidentLevels.map((accidentLevel) => ({
      ...accidentLevel.toJSON(),
      createdBy: users.find((user) => user.id === accidentLevel.createdBy) || null,
      updatedBy:
        users.find((user) => user.id === accidentLevel.updatedBy) || null,
    }));
  },
  async findById(id) {
    const accidentLevel = await AccidentLevel.findByPk(id);
    const userIds = [accidentLevel.createdBy];
    const users = await getUserByIds(userIds);
    return {
      ...accidentLevel.toJSON(),
      createdBy:
        users.find((user) => user.id === accidentLevel.createdBy) || null,
      updatedBy:
        users.find((user) => user.id === accidentLevel.updatedBy) || null,
    };
  },
  async update(id, data, req) {
    validateAccidentLevelUpdate(data);
    const userId = req.user.userId;
    const accidentLevel = await AccidentLevel.findByPk(id);
    if (!accidentLevel) throw new Error("AccidentLevel not found");
    data.updatedBy = userId;
    return sequelize.transaction(async () => {
      const updated = await accidentLevel.update({
        ...data,
        rank: data.rank.toUpperCase(),
      });
      await logAction({
        userId,
        action: "update",
        entity: "AccidentLevel",
        entityId: id,
        previousData: accidentLevel.toJSON(),
        newData: updated.toJSON(),
        req,
      });
      return updated;
    });
  },
  async delete(id, req) {
    const userId = req.user.userId;
    const accidentLevel = await AccidentLevel.findByPk(id);
    if (!accidentLevel) return null;
    return sequelize.transaction(async () => {
      await accidentLevel.destroy();
      await logAction({
        userId,
        action: "delete",
        entity: "AccidentLevel",
        entityId: id,
        previousData: accidentLevel.toJSON(),
        newData: null,
        req,
      });
      return accidentLevel;
    });
  },
};
