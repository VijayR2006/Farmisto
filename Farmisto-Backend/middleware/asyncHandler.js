const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error("Unhandled async error:", err.message);
    if (res.headersSent) return next(err);

    if (err.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ message: "Please enter valid information." });
    }
    if (err.code === "JWT_SECRET_MISSING") {
      return res.status(503).json({ message: "Authentication is temporarily unavailable. Please try again later." });
    }
    return res.status(500).json({ message: "Unable to process your request. Please try again." });
  });
};

module.exports = asyncHandler;
