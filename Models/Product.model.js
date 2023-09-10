const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const ProductSchema = new Scheme({
    name: { type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, require: true},
    category:  {type: String, require: true},
    image:  {type: String, require: true}
});

const Product =mongoose.model('product', ProductSchema);
module.exports = Product;