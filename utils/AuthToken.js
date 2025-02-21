import jwt from "jsonwebtoken";


export const verifyToken = (req, res) => {
  // Get token from header
  const token = req.headers.authorization?.split(" ")[1]; // فرض: "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    // Token validation
    const decoded = jwt.verify(token, process.env.MY_SECRET_USERSTASK);
    // const decoded = await jwt.verify(token, process.env.MY_SECRET);
    return decoded;
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// module.exports = { verifyToken };
