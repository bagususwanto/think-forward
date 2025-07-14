import { AccidentLevel, sequelize } from "../models/index.js";
import {
  accidentLevelCreateSchema,
  accidentLevelUpdateSchema,
} from "../schemas/accidentLevelSchema.js";
import { logAction } from "./logService.js";

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
    return AccidentLevel.findAll();
  },
  async findById(id) {
    return AccidentLevel.findByPk(id);
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
