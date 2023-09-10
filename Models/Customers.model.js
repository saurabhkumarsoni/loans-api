const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  street: { type: String, required: false },
  suite: { type: String, required: false },
  street: { type: String, required: false },
  zipcode: { type: String, required: false },
  geo: {
    lat: { type: String, required: false },
    lng: { type: String, required: false },
  },
});

const companySchema = new Schema({
  name: { type: String, required: false },
  address: { type: String, required: false },
});

const CustomerSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  address: addressSchema,
  phone: { type: String, require: true },
  website: { type: String },
  company: companySchema,
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
