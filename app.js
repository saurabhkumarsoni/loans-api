const express = require('express');
const morgan = require('morgan');
const createError  = require('http-errors');
require('dotenv').config();
require('./helpers/init_mongodb');
const {verifyAccessToken, verifyRefreshToken} = require('./helpers/jwt_helper');
const client = require('./helpers/init_redis');


const AuthRoutes = require('./Routes/Auth.route');
const indexRoutes = require('./Routes/index');
const usersRoutes = require('./Routes/users');
const customersRoutes = require('./Routes/customers');
const loansRoutes = require('./Routes/loans');
const paymentsRoutes = require('./Routes/payments');
const invoicesRoutes = require('./Routes/invoices');
const settingsRoutes = require('./Routes/settings');

const app = express();
const PORT = 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', verifyAccessToken, verifyRefreshToken, async (req, res, next) =>{
    debugger;
    
    res.send('get api called');
})

app.get('/customers', verifyAccessToken, verifyRefreshToken, async (req, res, next) =>{
    debugger;
    
    res.send('get api called');
})

app.use('/auth', AuthRoutes);
app.use('/customers', customersRoutes);

app.use(async(req, res, next) =>{
    next(createError.NotFound())
});

app.use((error,req,res,next) =>{
    res.status(error.status || 500);
    res.send({
        error: {
            status: error.status || 500,
            message: error.message
        }
    })
})




app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})