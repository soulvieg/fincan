// To ensure that the current admin is an overseeing_admin:
module.exports = function (req, res, next) {
  if (!req.session.admin || req.session.admin.role !== 'overseeingAdmin') {
    return res.status(403).json({ message: "Access denied. Overseeing admin only." });
  }
  next();
};
