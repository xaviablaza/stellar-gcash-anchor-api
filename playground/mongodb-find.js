const {MongoClient, ObjectID} = require('mongodb');

// Connect to the MongoDB database on our local machine
MongoClient.connect('mongodb://localhost:27017/GCashApp', (err, db) => {
    // Handle errors
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('CashInRequests').find({
        _id: new ObjectID("59d962c7271bd10f74b6c620")
    }).toArray().then((docs) => {
        console.log('CashInRequests');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch CashInRequests', err);
    });

    // db.close();
});