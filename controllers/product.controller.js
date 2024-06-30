// const { query } = require("express");
const { buildCriteria } = require("../helpers/product.helper");
const Product = require("../models/product.model");

async function getProductsCount(req, res) {
  const { query } = req;
  const criteria = buildCriteria(query);
  try {
    const count = await Product.countDocuments(criteria);
    res.json({ count });
  } catch (error) {
    console.log(
      "products.controller, getProductsCount. Error while getting productss count"
    );
    res.status(500).json({ mesagge: error.mesagge });
  }
}

async function getProducts(req, res) {
  const { query } = req;
  const criteria = buildCriteria(query);

  let page = query.page || 1;
  if (page < 1) {
    page = 1;
  }

  const limit = query.limit || 6;
  const startIndex = (page - 1) * limit || 0;

  try {
    const products = await Product.find(criteria).skip(startIndex).limit(limit);
    res.json(products);
  } catch (error) {
    console.log(
      "products.controller, getProducts. Error while getting products"
    );
    res.status(500).json({ message: error.message });
  }
}

async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    if (error.name === "CastError") {
      console.log(
        `product.controller, getProductById. Product not found with id: ${id}`
      );
      return res.status(404).json({ message: "Product not found" });
    }
    console.log(
      `product.controller, getProductById. Error while getting product with id: ${id}`,
      error.name
    );
    res.status(500).json({ message: error.mesagge });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      console.log(
        `product.controller, deleteProduct. product not found with id: ${id}`
      );
      return res.status(404).json({ message: "product not found" });
    }
    console.log(
      `product.controller, deleteProduct. Error while deleting product with id: ${id}`
    );
    res.status(500).json({ mesagge: error.mesage });
  }
}

async function addProduct(req, res) {
  const productToAdd = req.body;
  const newProduct = new Product(productToAdd);
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log("product.controller, addProduct. Error while creating product");
    if (error.name === "ValidationError") {
      console.log(`product.controller, addProduct. ${error.mesage} `);
      res.status(500).json({ message: "Server error while creating robot" });
    }
  }
}

async function editProduct(req, res) {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    if ((error.name = "CastError")) {
      console.log(
        `product.controller, editProduct. product not found with id: ${id}`
      );
      return res.status(404).json({ message: "product not found" });
    }
    console.log(
      `product.controller, editProduct. Error while updating Product with id: ${id}`
    );

    if (!error.name === "ValidationError") {
      console.log(`product.controller, editProduct. ${error.message}`);
      res.status(400).json({ message: error.message });
    } else {
      console.log(`product.controller, updateProduct. ${error.message}`);
      res.status(500).json({ message: "Server error while updating product" });
    }
  }
}

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  addProduct,
  editProduct,
  getProductsCount,
};
