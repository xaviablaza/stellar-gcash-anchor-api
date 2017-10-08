// Require the mongoose ORM
var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // Use built-in Promises
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/GCashApp'); // Connect to the database

module.exports = {mongoose};