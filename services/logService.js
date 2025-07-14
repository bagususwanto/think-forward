import { Log } from "../models/index.js";

export async function logAction({
  userId,
  action,
  entity,
  entityId,
  previousData,
  newData,
  transaction,
  req,
}) {
  const ipAddress = req.ip || null;
  const userAgent = req.headers["user-agent"] || null;
  console.log(ipAddress, userAgent);
  await Log.create(
    {
      userId,
      action,
      entity,
      entityId,
      previousData: previousData ? JSON.stringify(previousData) : null,
      newData: newData ? JSON.stringify(newData) : null,
      ipAddress,
      userAgent: userAgent || null,
    },
    { transaction }
  );
}
