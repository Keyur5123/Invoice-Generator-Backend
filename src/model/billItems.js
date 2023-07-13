const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
    billItems: [{
        partyChNo: {
            type: String,
            required: true,
        },
        productsIds: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Products'
        },
        pcs: {
            type: Number,
            required: true,
        },
        mtr: {
            type: Number,
            required: true,
        },
        item_amount: {
            type: Number,
            required: true,
        }
    }]
})

const BillItems = mongoose.model('BillItems', billSchema);

module.exports = BillItems;