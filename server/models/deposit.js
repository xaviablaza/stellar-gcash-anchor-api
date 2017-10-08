var mongoose = require('mongoose');

// Define the model here
var Deposit = mongoose.model('Deposit', {

    // All required; part of the cash-in request
    phone: {
        type: String,
        required: true,
        minlength: 11,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 12
    },

    // Upon receiving the deposit, reference number is generated and updated in this document
    referenceNumber: {
        type: Number,
        default: null
    },

    // When the user confirms the reference number, this gets updated
    confirmedAt: {
        type: Number,
        default: null
    }
});

module.exports = {Deposit};