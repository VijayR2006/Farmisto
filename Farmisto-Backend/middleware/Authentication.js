const { verifyToken } = require("./TokenAuth");
const User = require("../models/User");

const Authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Unauthorized: No token provided" });
    }

    const token = authHeader.slice("Bearer ".length).trim();
    const person = await verifyToken(token);

    if (!person || person.success === false || !person.id) {
      return res.status(401).json({ msg: "Unauthorized: Invalid or expired token" });
    }

    const user = await User.findById(person.id);
    if (!user || (person.tokenVersion || 0) !== (user.tokenVersion || 0)) {
      return res.status(401).json({ msg: "Unauthorized: Invalid or expired token" });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.userName,
      role: user.role,
      location: user.userLocation,
      tokenVersion: user.tokenVersion || 0,
    };
    next();
  } catch (err) {
    console.error("Authentication failed:", err.message);
    return res.status(503).json({ message: "Unable to process your request. Please try again." });
  }
};

module.exports = Authentication;
