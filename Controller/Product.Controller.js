const createError = require("http-errors");
const mongoose = require("mongoose");
const Product = require("../Models/Product.model");

module.exports = {
  productList: async (req, res, next) => {
    try {
      const results = await Product.find({}, { __v: 0 });
      res.send(results);
    } catch (error) {
      if (error.name === "ValidationError") {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  addProduct: async (req, res, next) => {
    console.log(req.body)
    try {
      const product = new Product(req.body);
      const result = await product.save();
      res.send(result);
    } catch (error) {
      if (error.name === "ValidationError") {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  findProductById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw createError(404, "Product does not exist.");
      }
      res.send(product);
    } catch (error) {
      if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
        next(createError.BadRequest("Invalid product id"));
      } else {
        next(error);
      }
    }
  },

  deleteProduct: async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await Product.findByIdAndDelete(id);
      if (!result) {
        throw createError(404, "Product does not exist.");
      }
      res.send(result);
    } catch (error) {
      if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
        next(createError.BadRequest("Invalid product id"));
      } else {
        next(error);
      }
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };
      const result = await Product.findByIdAndUpdate(id, updates, options);
      if (!result) {
        throw createError(404, "Product does not exist.");
      }
      res.send(result);
    } catch (error) {
      if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
        next(createError.BadRequest("Invalid product id"));
      } else {
        next(error);
      }
    }
  },
};
