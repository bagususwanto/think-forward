export function successResponse(
  res,
  { message = "Success", data = null, status = 200, meta = null }
) {
  return res.status(status).json({
    success: true,
    message,
    data,
    meta,
  });
}
