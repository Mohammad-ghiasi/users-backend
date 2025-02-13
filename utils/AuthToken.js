const jwt = require("jsonwebtoken");

const verifyToken = async (req, res) => {
  // Get token from header
  const token = req.headers.authorization?.split(" ")[1]; // فرض: "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    // Token validation
    const decoded = await jwt.verify(token, "my_secret");
    // const decoded = await jwt.verify(token, process.env.MY_SECRET);
    return decoded;
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyToken };
