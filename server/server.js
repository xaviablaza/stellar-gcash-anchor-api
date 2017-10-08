const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Deposit} = require('./models/deposit');

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

app.patch('/deposits/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['referenceNumber']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // Check if there has been an confirmation sent by the user

    Deposit.findByIdAndUpdate(id, {$set: body}, {new: true}).then((deposit) => {
       if (!deposit) {
           return res.status(404).send();
       }
       res.send({deposit})
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};