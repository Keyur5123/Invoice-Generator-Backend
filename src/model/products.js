const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: 'String',
        required: true
    },
    rate: {
        type: 'Number',
        required: true
    }
})

const Products = mongoose.model('Products',productSchema);

module.exports = Products;