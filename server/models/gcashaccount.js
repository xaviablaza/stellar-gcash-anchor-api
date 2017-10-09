var mongoose = require('mongoose');

var GCashAccount = mongoose.model('GCashAccount', {

    address: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 11,
        trim: true
    },
    memo_type: {
        type: String
    },
    memo: {
        type: String,
        capped: 32 // 28 bytes for UTF-8 text
    }

});

module.exports = {GCashAccount};