const createError = require("http-errors");
const Customer = require('../Models/Customers.model')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_helper");

module.exports = {
  customerList: async (req, res, next) => {
    try {
      const results = await Customer.find({}, { __v: 0 });
      res.send(results);
    } catch (error) {
      if (error.name === "ValidationError") {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  addCustomer: async (req, res, next) => {
    console.log("CUSTOMER BODY",req.body);
    try {
      const customer = new Customer(req.body);
      console.log('customer', customer)
      const result = await customer.save();
      res.send(result);
    } catch (error) {
      if (error.name === "ValidationError") {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  findCustomerById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const customer = await Customer.findById(id);
      if (!customer) {
        throw createError(404, "Customer does not exist.");
      }
      res.send(customer);
    } catch (error) {
      if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
        next(createError.BadRequest("Invalid Customer id"));
      } else {
        next(error);
      }
    }
  },

  deleteCustomer: async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await Customer.findByIdAndDelete(id);
      if (!result) {
        throw createError(404, "Customer does not exist.");
      }
      res.send(result);
    } catch (error) {
      if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
        next(createError.BadRequest("Invalid Customer id"));
      } else {
        next(error);
      }
    }
  },

  updateCustomer: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };
      const result = await Customer.findByIdAndUpdate(id, updates, options);
      if (!result) {
        throw createError(404, "Customer does not exist.");
      }
      res.send(result);
    } catch (error) {
      if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
        next(createError.BadRequest("Invalid Customer id"));
      } else {
        next(error);
      }
    }
  },
};
