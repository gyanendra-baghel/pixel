export const authorizeRole = (accessRoles) => (req, res, next) => {
  if (!req.user || !accessRoles.includes(req.user.role.toUpperCase())) {
    console.log(`User role: ${req.user.role}`);
    console.log(`Access roles:`, accessRoles);
    return res.status(403).json({ message: `Access denied: ${accessRoles.toString()} role required` });
  }
  next();
};
