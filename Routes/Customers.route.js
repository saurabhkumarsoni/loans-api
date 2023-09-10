const express = require('express');
const router = express.Router();
const createError = require("http-errors");
const CustomersController = require('../Controller/Customers.Controller')

const Customer = require("../Models/Customers.model");
const { verifyAccessToken } = require('../helpers/jwt_helper');

router.get('/',verifyAccessToken, CustomersController.customerList);

router.post('/',verifyAccessToken, CustomersController.addCustomer);

router.get('/:id', CustomersController.findCustomerById);

router.delete('/:id', CustomersController.deleteCustomer);

router.patch('/:id', CustomersController.updateCustomer);



module.exports = router;