// Require the mongoose ORM
var mongoose = require('mongoose');

// Use built-in Promises
mongoose.Promise = global.Promise;

// Connect to the database
mongoose.connect(process.env.MONGODB_URI, {
    useMongoClient: true
});

module.exports = {mongoose};