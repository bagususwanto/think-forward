import { VoiceMember } from "../models/index.js";
import { voiceMemberCreateSchema } from "../schemas/voiceMemberSchema.js";
import { logAction } from "./logService.js";

function validateVoiceMemberCreate(data) {
  const { error } = voiceMemberCreateSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const err = new Error("Validation error");
    err.details = error.details.map((d) => d.message);
    throw err;
  }
}

export default {
  async create(data, submissionId, userId, req) {
    validateVoiceMemberCreate(data);
    if (!req.file) {
      throw new Error("File proof is required");
    }

    const voiceMember = await VoiceMember.create({
      submissionId,
      proof: req.file.path,
      ...data,
    });
    await logAction({
      userId,
      action: "create",
      entity: "VoiceMember",
      entityId: voiceMember.id,
      previousData: null,
      newData: voiceMember.toJSON(),
      req,
    });
    return voiceMember;
  },
};
