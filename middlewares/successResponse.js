export function successResponse(
  res,
  { message = "Success", data = null, status = 200 }
) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}
