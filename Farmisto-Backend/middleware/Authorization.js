const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication is required." });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You do not have permission to perform this action." });
  }
  return next();
};

module.exports = requireRole;
