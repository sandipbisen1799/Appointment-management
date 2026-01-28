export const authorize = (...accountType) => (req, res, next) => {
  if (!accountType.includes(req.user.accountType)) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to access this route",
    });
  }
  next();
};
