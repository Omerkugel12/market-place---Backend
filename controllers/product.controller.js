const fs = require("fs");
const PRODUCT = require("../data/data.json");

function makeId() {
  while (true) {
    const newId = Math.random().toString(36).substr(2, 9);
    const products = PRODUCT;
    const productIndex = products.findIndex((product) => {
      return product._id === newId;
    });
    if (productIndex === -1) {
      return newId;
    }
  }
}

function getProducts(req, res) {
  res.status(200).json(PRODUCT);
}

function getProductById(req, res) {
  const { id } = req.params;

  const product = PRODUCT.find((product) => {
    return product._id === id;
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json(product);
}

function deleteProduct(req, res) {
  const { id } = req.params;

  const products = [...PRODUCT];
  const productIndex = products.findIndex((product) => {
    return product._id === id;
  });

  if (productIndex === -1) {
    res.status(404).json({ message: "product not found" });
  }

  products.splice(productIndex, 1);

  fs.writeFileSync("./data/data.json", JSON.stringify(products));
  res.status(200).json({ message: " Item deleted" });
}

function addProduct(req, res) {
  const products = [...PRODUCT];
  const newProduct = req.body;
  newProduct._id = makeId();
  const updatedProducts = [...products, newProduct];
  fs.writeFileSync("./data/data.json", JSON.stringify(updatedProducts));
  res.status(201).json({ message: "Product added" });
}

function editProduct(req, res) {
  const { id } = req.params;
  const products = [...PRODUCT];
  const editedProduct = req.body;
  // const updatedProducts
  const productToUpdateIndex = products.findIndex((product) => {
    return product._id === id;
  });

  if (productToUpdateIndex === -1) {
    res.status(404).json({ message: "Product not found" });
  }
  products[productToUpdateIndex] = editedProduct;
  fs.writeFileSync("./data/data.json", JSON.stringify(products));
  res.status(200).json({ message: "Product updated" });
}

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  addProduct,
  editProduct,
};
