exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  next();
};

exports.isStoreOwner = (req, res, next) => {
  if (req.user.role !== "STORE_OWNER") {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  next();
};