const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    const error = new Error("JWT_SECRET is not configured");
    error.code = "JWT_SECRET_MISSING";
    throw error;
  }
  return secret;
};

// Generate a JWT token
const GenerateToken = (person) => {
  const token = JWT.sign(
    {
      id: person._id,
      email: person.email,
      name: person.userName,
      role: person.role || "consumer",
      location: person.userLocation,
      tokenVersion: person.tokenVersion || 0,
    },
    getJwtSecret(),
    { expiresIn: "3d" }
  );
  return token;
};

// Verify a JWT token
const verifyToken = async(token) => {
  if (!token || typeof token !== "string") {
    return { success: false, error: "Invalid token format" };
  }
  try {
    const person = JWT.verify(token, getJwtSecret());
    return person;
  } catch (err) {
    return { success: false, error: err.code === "JWT_SECRET_MISSING" ? err.code : "Invalid or expired token" };
  }
};

module.exports = { GenerateToken, verifyToken, getJwtSecret };
