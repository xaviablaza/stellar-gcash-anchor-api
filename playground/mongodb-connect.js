// Require the MongoDB library
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);
//
// var cashinrequest = {phone: '09178838668', amount: 100.00, currency: 'GCASH', status: 'awaiting deposit'};
// var {phone} = cashinrequest;
// console.log(phone);

// Connect to the MongoDB database on our local machine
MongoClient.connect('mongodb://localhost:27017/GCashApp', (err, db) => {
    // Handle errors
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('CashInRequests').insertOne({
        phone: '09178838668',
        amount: 100.00,
        currency: 'GCASH',
        status: 'awaiting deposit'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert cashin request', err);
        }

        // Pretty print the documents that were added
        console.log(JSON.stringify(result.ops, undefined, 2));
        console.log(result.ops[0]._id.getTimestamp());
    });

    db.close();
});