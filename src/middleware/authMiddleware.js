// Middleware to verify roles
const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "User Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: "Sorry, you do not have permission to access this resource.",
        });
    }
    next();
  };
};

module.exports = verifyRole;
