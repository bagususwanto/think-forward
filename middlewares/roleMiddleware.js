const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roleName) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized, you must be logged in to access this resource",
      });
    }
    const userRole = req.user.roleName;
    const allowed = Array.isArray(allowedRoles)
      ? allowedRoles.includes(userRole)
      : allowedRoles === userRole;
    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Forbidden, you are not authorized to access this resource",
      });
    }
    next();
  };
};

export default roleMiddleware;
