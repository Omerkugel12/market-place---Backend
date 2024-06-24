// const fs = require("fs");
// const PRODUCT = require("../data/data.json");

const { query } = require("express");
const Product = require("../models/products.model");

// function makeId() {
//   while (true) {
//     const newId = Math.random().toString(36).substr(2, 9);
//     const products = PRODUCT;
//     const productIndex = products.findIndex((product) => {
//       return product._id === newId;
//     });
//     if (productIndex === -1) {
//       return newId;
//     }
//   }
// }

// function getProducts(req, res) {
//   res.status(200).json(PRODUCT);
// }

async function getProductsCount(req, res) {
  const name = req.query.name || "";
  const minPrice = req.query.minPrice || 0;
  const maxPrice = req.query.maxPrice || Number.MAX_SAFE_INTEGER;
  try {
    const count = await Product.countDocuments({
      name: { $regex: name, $options: "i" },
      price: { $gte: minPrice, $lte: maxPrice },
    });
    res.json({ count });
  } catch (error) {
    console.log(
      "products.controller, getProductsCount. Error while getting productss count"
    );
    res.status(500).json({ mesagge: error.mesagge });
  }
}

async function getProducts(req, res) {
  const name = req.query.name || "";
  const minPrice = req.query.minPrice || 0;
  const maxPrice = req.query.maxPrice || Number.MAX_SAFE_INTEGER;
  try {
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
      price: { $gte: minPrice, $lte: maxPrice },
    });
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
    res.json(product);
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

// function getProductById(req, res) {
//   const { id } = req.params;

//   const product = PRODUCT.find((product) => {
//     return product._id === id;
//   });

//   if (!product) {
//     return res.status(404).json({ message: "Product not found" });
//   }
//   res.status(200).json(product);
// }

async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      console.log(
        `product.controller, deleteProduct. product not found with id: ${id}`
      );
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.log(
      `product.controller, deleteProduct. Error while deleting product with id: ${id}`
    );
    res.status(500).json({ mesagge: error.mesage });
  }
}

// function deleteProduct(req, res) {
//   const { id } = req.params;

//   const products = [...PRODUCT];
//   const productIndex = products.findIndex((product) => {
//     return product._id === id;
//   });

//   if (productIndex === -1) {
//     res.status(404).json({ message: "product not found" });
//   }

//   products.splice(productIndex, 1);

//   // fs.writeFileSync("./data/data.json", JSON.stringify(products));
//   res.status(200).json({ message: " Item deleted" });
// }

async function addProduct(req, res) {
  const productToAdd = req.body;
  const newProduct = new Product(productToAdd);
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json({ savedProduct });
  } catch (error) {
    console.log("product.controller, addProduct. Error while creating product");
    if (error.name === "ValidationError") {
      console.log(`product.controller, addProduct. ${error.mesage} `);
      res.status(500).json({ message: "Server error while creating robot" });
    }
  }
}

// function addProduct(req, res) {
//   const products = [...PRODUCT];
//   const newProduct = req.body;
//   newProduct._id = makeId();
//   const updatedProducts = [...products, newProduct];
//   // fs.writeFileSync("./data/data.json", JSON.stringify(updatedProducts));
//   res.status(201).json({ message: "Product added" });
// }

async function editProduct(req, res) {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      console.log(
        `product.controller, editProduct. product not found with id: ${id}`
      );
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
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

// function editProduct(req, res) {
//   const { id } = req.params;
//   const products = [...PRODUCT];
//   const editedProduct = req.body;
//   // const updatedProducts
//   const productToUpdateIndex = products.findIndex((product) => {
//     return product._id === id;
//   });

//   if (productToUpdateIndex === -1) {
//     res.status(404).json({ message: "Product not found" });
//   }
//   products[productToUpdateIndex] = editedProduct;
//   // fs.writeFileSync("./data/data.json", JSON.stringify(products));
//   res.status(200).json({ message: "Product updated" });
// }

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  addProduct,
  editProduct,
  getProductsCount,
};
