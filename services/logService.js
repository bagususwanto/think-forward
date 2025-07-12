import { Log } from "../models/index.js";

export async function logAction({
  userId,
  action,
  entity,
  entityId,
  previousData,
  newData,
  ipAddress = null,
  userAgent = null,
  transaction,
}) {
  await Log.create(
    {
      userId,
      action,
      entity,
      entityId,
      previousData: previousData ? JSON.stringify(previousData) : null,
      newData: newData ? JSON.stringify(newData) : null,
      ipAddress,
      userAgent,
    },
    { transaction }
  );
}
