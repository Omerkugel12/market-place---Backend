const express = require("express");
const {
  verifyToken,
  authorizeProductOwner,
} = require("../middleware/auth.middleware");

const {
  getProducts,
  getProductById,
  deleteProduct,
  addProduct,
  editProduct,
  getProductsCount,
} = require("../controllers/product.controller.js");

const router = express.Router();

router.get("/", getProducts);
router.get("/count", getProductsCount);
router.get("/:id", getProductById);
router.delete("/:id", verifyToken, authorizeProductOwner, deleteProduct);
router.post("/", verifyToken, addProduct);
router.put("/:id", editProduct);

module.exports = router;
