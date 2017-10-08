const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Deposit} = require('./../server/models/deposit');

var id = '59d9b20b6d700820a48cb42c';

if (!ObjectID.isValid(id)) {
    console.log('ID not valid');
}

Deposit.find({
    _id: id
}).then((deposits) => {
    console.log('Deposits', deposits)
});

Deposit.findOne({
    _id: id
}).then((deposit) => {
    console.log('Deposit', deposit)
});

Deposit.findById(id).then((deposit) => {
    if (!deposit) {
        return console.log('Id not found');
    }
    console.log('Deposit By Id', deposit)
}).catch((e) => console.log(e));