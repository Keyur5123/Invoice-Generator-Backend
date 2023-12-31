const mongoose = require("mongoose");

const newInvoiceSchema = new mongoose.Schema({
    party_name : {
        type: String,
        required: true
    },
    address : {
        type: String,
        required: true
    },
    bill_no : {
        type: String,
        required: true
    },
    paymentEntryStatus: {
        type: String,
        required: true
    },
    billItems: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'billitems'
    },
    discount: {
        type: Number,
        required: true,
        default: 0
    },
    igst: {
        type: Number,
        required: true,
        default: 0
    },
    sgst: {
        type: Number,
        required: true,
        default: 0
    },
    cgst: {
        type: Number,
        required: true,
        default: 0
    },
    tds: {
        type: Number,
        required: true,
        default: 0
    },
    is_paid: {
        type: Boolean,
        required: true,
        default: false
    },
    billSubTotalAmount: {
        type: Number,
        required: true,
    },
    billTotalAmount: {
        type: Number,
        required: true,
    },
    user_code : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userdatas'
    },
    date_created: { type: String, default: Date.now }
});

const AllInvoices = mongoose.model("allinvoices", newInvoiceSchema);

module.exports = AllInvoices;