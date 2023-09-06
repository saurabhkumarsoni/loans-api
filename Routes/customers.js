const express = require('express');
const router = express.Router();

const customerModel = require('../Models/Customers.model');


router.get('/customers', (req, res) =>{
    res.send('customer called');
});

module.exports = router;