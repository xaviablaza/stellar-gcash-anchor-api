var mongoose = require('mongoose');

var GCashSms = mongoose.model('GCashSms', {

    device_id: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    secret: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    referenceNumber: {
        type: Number,
        default: null
    },

});

module.exports = {GCashSms};