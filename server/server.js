var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Deposit} = require('./models/deposit');

var {ObjectID} = require('mongodb');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/deposits', (req, res) => {
    var deposit = new Deposit({
        phone: req.body.phone,
        amount: req.body.amount,
        currency: req.body.currency
    });

    deposit.save().then((doc) => {
      res.send(doc);
    }, (err) => {
        res
            .status(400)
            .send(err);
    });
});

app.get('/deposits', (req, res) => {
    Deposit.find().then((deposits) => {
        res.send({deposits});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/deposits/:id', (req, res) => {
    var id = req.params.id;
    // Validate id using isValid
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    // Query the database
    Deposit.findById(id).then((deposit) => {
        if (!deposit) {
            return res.status(404).send();
        }
        res.send({deposit});
    }, (e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};