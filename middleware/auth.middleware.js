const jwt = require("jsonwebtoken");
const Product = require("../models/product.model");

const { JWT_SECRET } = process.env;

function verifyToken(req, res, next) {
  // Get token from header, the client should be responsible for sending the token
  const token = req.header("Authorization").split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    req.userId = decoded.userId; // Add userId to request object
    next(); // Call next middleware
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

async function authorizeProductOwner(req, res, next) {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(400).json({ message: "product not found" });
  }
  if (product.user.toString() !== req.userId) {
    return res.status(403).json({ message: "user not authorized" });
  }
  next();
}

module.exports = { verifyToken, authorizeProductOwner };
