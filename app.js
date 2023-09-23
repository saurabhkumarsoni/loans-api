const express = require('express');
const morgan = require('morgan');
const createError  = require('http-errors');
require('dotenv').config();
require('./helpers/init_mongodb');
const {verifyAccessToken, verifyRefreshToken} = require('./helpers/jwt_helper');
const client = require('./helpers/init_redis');
// const { roles } = require("./helpers/constant");
const mongoose = require('mongoose');
// require('./helpers/check_role');




const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));


app.get('/', verifyAccessToken, async (req, res, next) =>{
    res.send('get api called');
})

app.use('/users', require('./Routes/Auth.route'));
app.use('/customers', require('./Routes/Customers.route'));
app.use('/product', require('./Routes/Product.route'));
app.use('/movie', require('./Routes/Movie.route'));


app.use(async(req, res, next) =>{
    next(createError.NotFound())
});

// error handler
app.use((error,req,res,next) =>{
    res.status(error.status || 500);
    res.send({
        error: {
            status: error.status || 500,
            message: error.message
        }
    })
});


app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})