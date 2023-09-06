const mongoose = require('mongoose');
const invoiceSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dob: String
})


const invoiceModel = mongoose.model('Invoice', invoiceSchema);

module.exports = invoiceModel;;